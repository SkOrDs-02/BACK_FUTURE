---
title: "Шифр AES став світовим стандартом шифрування даних"
subject: "tech"
short: "26 листопада 2001 року Національний інститут стандартів і технологій США (NIST) затвердив стандарт FIPS 197. Шифр Rijndael бельгійських криптографів став AES, на зміну застарілому DES."
before: "Державним стандартом шифрування в США з 1970-х був DES з коротким ключем, і новий алгоритм лише шукали на відкритому конкурсі."
after: "AES з ключами 128, 192 і 256 біт закріплений стандартом FIPS 197; оновлення 2023 року не змінило сам алгоритм."
yearOfEvent: 2001
relevantForEras: [1, 2]
region: "world"
sources:
  - title: "NIST CSRC: FIPS 197, Advanced Encryption Standard (AES)"
    url: "https://csrc.nist.gov/publications/detail/fips/197/final"
  - title: "NIST: Commerce Department Announces Winner of Global Information Security Competition (2000)"
    url: "https://www.nist.gov/news-events/news/2000/10/commerce-department-announces-winner-global-information-security"
  - title: "NIST CSRC: AES Development"
    url: "https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines/archived-crypto-projects/aes-development"
tags: ["шифрування", "криптографія", "стандарти", "кібербезпека"]
draft: false
---

Наприкінці 1990-х стандартним шифром для захисту даних у США лишався DES, створений ще в 1970-х. Його ключ був закоротким для тогочасних комп'ютерів, тож NIST оголосив відкритий міжнародний конкурс на новий алгоритм. У першому турі змагалися **15 кандидатів із 10 країн**, до фіналу вийшли п'ять: MARS, RC6, Rijndael, Serpent і Twofish.

2 жовтня 2000 року міністерство торгівлі США [назвало переможцем](https://www.nist.gov/news-events/news/2000/10/commerce-department-announces-winner-global-information-security) алгоритм **Rijndael** бельгійських криптографів Йоана Дамена і Вінсента Реймена. За оцінкою NIST, він дав найкраще поєднання стійкості, швидкодії, ефективності й гнучкості. Формально його закріпили стандартом **FIPS 197**, датованим **26 листопада 2001 року**.

Стандарт описує три варіанти шифру: AES-128, AES-192 і AES-256. Вони шифрують дані блоками по **128 біт** ключами завдовжки 128, 192 або 256 біт. Важливою була сама процедура: алгоритм обрали публічно, всі кандидати і їх аналіз були відкриті для перевірки криптографам усього світу.

Стандарт досі чинний. 2023 року NIST випустив [оновлену редакцію FIPS 197](https://csrc.nist.gov/publications/detail/fips/197/final), яка, за словами інституту, не вносить технічних змін в алгоритм. Тобто шифр, затверджений 2001 року, лишається тим самим.
