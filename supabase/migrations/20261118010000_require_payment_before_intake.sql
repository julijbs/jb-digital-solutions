-- A client may read their existing intake, but writes require a paid order.
-- Admins retain support access. Service-role webhook operations bypass RLS normally.
create or replace function public.has_paid_project_access(target_project uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select public.has_role(auth.uid(), 'admin_jb') or exists (
    select 1 from public.projects p
    join public.clients c on c.id = p.client_id
    join public.billing b on b.project_id = p.id and b.client_id = c.id
    where p.id = target_project and c.user_id = auth.uid() and b.status = 'paid'
      and (b.product_type = p.plan or (p.plan not in ('site_novo','gbp_avulso') and b.product_type in ('site','gbp','pacote_completo')))
  );
$$;
revoke all on function public.has_paid_project_access(uuid) from public;
grant execute on function public.has_paid_project_access(uuid) to authenticated;

drop policy if exists "Payment required before intake insert" on public.client_intake;
create policy "Payment required before intake insert" on public.client_intake
as restrictive for insert to authenticated
with check (public.has_paid_project_access(project_id));
drop policy if exists "Payment required before intake update" on public.client_intake;
create policy "Payment required before intake update" on public.client_intake
as restrictive for update to authenticated
using (public.has_paid_project_access(project_id))
with check (public.has_paid_project_access(project_id));

create or replace function public.prepare_intake_after_payment()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if new.status = 'paid' and new.product_type in ('site_novo','gbp_avulso') then
    insert into public.client_intake(project_id, step_current, business_data)
    values (new.project_id, 1, '{}'::jsonb)
    on conflict (project_id) do nothing;
  end if;
  return new;
end;
$$;
revoke all on function public.prepare_intake_after_payment() from public;
drop trigger if exists prepare_intake_on_payment on public.billing;
create trigger prepare_intake_on_payment
  after insert or update of status on public.billing
  for each row execute function public.prepare_intake_after_payment();
-- Preserve the information existing clients already entered; initialize missing paid intakes only.
insert into public.client_intake(project_id, step_current, business_data)
select distinct project_id, 1, '{}'::jsonb from public.billing
where status='paid' and product_type in ('site_novo','gbp_avulso')
on conflict (project_id) do nothing;
