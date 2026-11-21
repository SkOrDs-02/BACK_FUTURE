---
title: "Лінус Торвальдс створив Git, і він став стандартом для програмістів"
subject: "tech"
short: "7 квітня 2005 року Лінус Торвальдс зробив перший коміт системи контролю версій Git, яку написав за кілька днів після втрати безкоштовного доступу до BitKeeper. Сьогодні на Git тримається більшість програмного коду у світі."
before: "Історію змін у коді вели централізовані системи на кшталт CVS і Subversion або платні інструменти."
after: "Git став розподіленим стандартом: кожен розробник має повну копію історії, а на ньому працюють GitHub, GitLab і майже всі відкриті проєкти."
yearOfEvent: 2005
relevantForEras: [1, 2, 3]
region: "world"
sources:
  - title: "Git source repository: commit e83c516, Initial revision of git (7 April 2005)"
    url: "https://googlers.googlesource.com/jrn/git/+/e83c5163316f89bfbde7d9ab23ca2e25604af290"
  - title: "GitHub Blog: Git turns 20. A Q&A with Linus Torvalds"
    url: "https://github.blog/open-source/git/git-turns-20-a-qa-with-linus-torvalds/"
  - title: "Atlassian: What can we learn from the code in Git's initial commit?"
    url: "https://www.atlassian.com/blog/bitbucket/what-can-we-learn-from-the-code-in-gits-initial-commit"
tags: ["програмування", "відкритий код", "linux", "контроль версій"]
draft: false
---

У 1990-х команди програмістів зберігали код на центральному сервері: CVS, згодом Subversion. Щоб подивитися історію або зафіксувати зміни, треба було мати зв'язок із сервером, а паралельна робота над кількома гілками часто закінчувалась ручним злиттям. Розробники ядра Linux з 2002 року користувались пропрієтарною системою BitKeeper, яку її власник надавав відкритому проєкту безкоштовно.

У квітні 2005 року компанія BitMover відкликала безкоштовну версію BitKeeper через звинувачення, що хтось із розробників розібрав її протокол. Лінус Торвальдс вирішив написати власний інструмент. **7 квітня 2005 року** з'явився [перший коміт Git](https://googlers.googlesource.com/jrn/git/+/e83c5163316f89bfbde7d9ab23ca2e25604af290) з підписом «Initial revision of "git", the information manager from hell». За підрахунком [Atlassian](https://www.atlassian.com/blog/bitbucket/what-can-we-learn-from-the-code-in-gits-initial-commit), це було **10 файлів** і менше тисячі рядків коду мовою C. Уже **16 квітня** в Git записали перший коміт ядра Linux.

Git розподілений: кожна копія репозиторію містить усю історію змін, тому працювати можна без сервера, а гілки створюються й зливаються за секунди. Кожна версія файлів ідентифікується криптографічним хешем, і непомітно підмінити історію неможливо. 26 липня 2005 року Торвальдс передав супровід проєкту **Джуніо Хамано**, а в грудні вийшла версія 1.0.

Довкола Git виросли сервіси GitHub, GitLab і Bitbucket, і слово «коміт» стало частиною професійного жаргону. Git використовують від студентських проєктів до операційних систем, а навички роботи з ним вимагають майже в кожній вакансії розробника.
