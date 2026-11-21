---
title: "Збійне оновлення CrowdStrike вивело з ладу 8,5 млн комп'ютерів"
subject: "tech"
short: "19 липня 2024 року помилкове оновлення антивірусного агента CrowdStrike Falcon спричинило «синій екран» на 8,5 млн комп'ютерів з Windows по всьому світу. Збій назвали одним з наймасштабніших в історії ІТ."
before: "Наймасштабнішими глобальними ІТ-інцидентами вважали атаки вірусів і хакерів."
after: "Одне невдале оновлення захисної програми без атаки ззовні зупинило мільйони комп'ютерів одночасно."
yearOfEvent: 2024
relevantForEras: [1, 2, 3, 4, 5]
region: "world"
sources:
  - title: "Microsoft: Helping our customers through the CrowdStrike outage (20.07.2024)"
    url: "https://blogs.microsoft.com/blog/2024/07/20/helping-our-customers-through-the-crowdstrike-outage/"
  - title: "CrowdStrike: Channel File 291 Incident Root Cause Analysis (06.08.2024)"
    url: "https://www.crowdstrike.com/wp-content/uploads/2024/08/Channel-File-291-Incident-Root-Cause-Analysis-08.06.2024.pdf"
  - title: "TechCrunch: Microsoft says 8.5M Windows devices were affected by CrowdStrike outage"
    url: "https://techcrunch.com/2024/07/20/microsoft-says-8-5m-windows-devices-were-affected-by-crowdstrike-outage/"
tags: ["кібербезпека", "windows", "збій", "програмне забезпечення", "інфраструктура"]
draft: false
---

Коли у 1990-х і 2000-х говорили про глобальні комп'ютерні катастрофи, мали на увазі віруси, хакерів або «проблему 2000 року». Що масовий збій може спричинити сама програма захисту, яку компанії ставлять, щоб уберегтись від атак, здавалось малоймовірним.

**19 липня 2024 року** компанія CrowdStrike розіслала оновлення конфігурації для свого агента Falcon на комп'ютерах з Windows, так званий **Channel File 291**. Комп'ютери, що його отримали, падали в «синій екран смерті» і не могли нормально завантажитись. Наступного дня Microsoft [оцінила](https://blogs.microsoft.com/blog/2024/07/20/helping-our-customers-through-the-crowdstrike-outage/) кількість уражених пристроїв у **8,5 млн**, тобто менше ніж 1 % усіх машин з Windows, але визнала, що збій мав широкі економічні й суспільні наслідки. Комп'ютерів Mac і Linux він не зачепив.

Причину CrowdStrike описала в [звіті](https://www.crowdstrike.com/wp-content/uploads/2024/08/Channel-File-291-Incident-Root-Cause-Analysis-08.06.2024.pdf) 6 серпня 2024 року. Новий шаблон правил передбачав **21 поле** вхідних даних, а код агента передавав лише **20**. Оновлення змусило агент прочитати 21-ше поле, і він звернувся до пам'яті поза межами масиву, що й зупинило систему. Помилку пропустив валідатор, який мав перевіряти такі файли перед розсиланням.

25 липня 2024 року CrowdStrike додала перевірку меж масиву, а згодом змінила внутрішнє тестування оновлень. Інцидент показав, що одна помилка в автоматичному оновленні від одного постачальника може одночасно зупинити мільйони комп'ютерів у різних країнах.
