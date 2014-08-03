
create user todo_user password 'todo_password';

create table public.todo (
  items json
);

alter table public.todo owner to todo_user;

create or replace function public.upsert_todo_list(todo_list json) returns void as $$
begin
  update todo set items = todo_list;
  if (NOT FOUND) then
    insert into todo(items) values(todo_list);
  end if;
end;
$$ language plpgsql;

alter function public.upsert_todo_list(json) owner to todo_user;
