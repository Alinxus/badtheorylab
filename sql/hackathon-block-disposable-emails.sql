-- Run this in Supabase SQL Editor for the hackathon registration database.
-- It removes existing disposable-email registrations and rejects future rows.

create or replace function is_blocked_hackathon_email_domain(email_value text)
returns boolean as $$
declare
  domain_value text;
  blocked_domains text[] := array[
    '007.hzeg.eu.org',
    '10minutemail.com',
    '20minutemail.com',
    '33mail.com',
    'anonaddy.com',
    'burnermail.io',
    'byom.de',
    'dispostable.com',
    'emailondeck.com',
    'fakeinbox.com',
    'getnada.com',
    'gamesense.eu.cc',
    'guerrillamail.biz',
    'guerrillamail.com',
    'guerrillamail.de',
    'guerrillamail.info',
    'guerrillamail.net',
    'guerrillamail.org',
    'huiyemao.dpdns.org',
    'iivylls.cc.cd',
    'maildrop.cc',
    'mailinator.com',
    'mailnesia.com',
    'mailpoof.com',
    'mailtemp.info',
    'mailx.04.mom',
    'mohmal.com',
    'moakt.com',
    'nimail.cn',
    'oakon.com',
    'ovom.us.ci',
    'qudone.net',
    'renatus.biz.id',
    'sharklasers.com',
    'temp-mail.org',
    'tempail.com',
    'tempmail.com',
    'tempmailo.com',
    'throwawaymail.com',
    'trashmail.com',
    'web-library.net',
    'woaisufulei.de5.net',
    'yopmail.com',
    'yyds.mcmdo.com',
    'zeabur.us.ci'
  ];
  blocked text;
begin
  if email_value is null or position('@' in email_value) = 0 then
    return false;
  end if;

  domain_value := lower(split_part(email_value, '@', 2));

  foreach blocked in array blocked_domains loop
    if domain_value = blocked or domain_value like '%.' || blocked then
      return true;
    end if;
  end loop;

  return false;
end;
$$ language plpgsql immutable;

delete from hackathon_registrations
where is_blocked_hackathon_email_domain(email);

create or replace function block_disposable_hackathon_registration_email()
returns trigger as $$
begin
  if is_blocked_hackathon_email_domain(new.email) then
    raise exception 'Disposable hackathon registration email domain is blocked: %',
      lower(split_part(new.email, '@', 2))
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists hackathon_registrations_block_disposable_email
on hackathon_registrations;

create trigger hackathon_registrations_block_disposable_email
before insert or update of email on hackathon_registrations
for each row execute function block_disposable_hackathon_registration_email();
