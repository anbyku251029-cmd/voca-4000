// Level 2 dataset builder
import fs from 'fs';
import path from 'path';

// Raw data chunks for Units 01 - 30
export const unitsPart1 = [
  // Unit 01
  {
    unit: 1,
    title: "The Twelve Months",
    words: [
      { word: "anxious", pos: "adj.", kor: "불안해하는, 걱정하는", ex: "She was anxious about not making her appointment on time.", q: "[Ex 1-A-1] a movement (a. pace / b. intent / c. lungs / d. motion) [정답: d. motion]" },
      { word: "awful", pos: "adj.", kor: "끔찍한, 지독한", ex: "Her performance last night was awful.", q: "[Ex 1-A-2] to look for (a. seek / b. possess / c. shine / d. desire) [정답: a. seek]" },
      { word: "consist", pos: "v.", kor: "~로 구성되다", ex: "Today's choices for lunch consisted of pizza, hamburgers, and hot dogs.", q: "[Ex 1-A-3] to pick up (a. eager / b. lift / c. remark / d. spill) [정답: b. lift]" },
      { word: "desire", pos: "v.", kor: "바라다, 욕망하다", ex: "My sister desires a big house and lots of money.", q: "[Ex 1-A-4] very fast (a. landscape / b. household / c. rapidly / d. awful) [정답: c. rapidly]" },
      { word: "eager", pos: "adj.", kor: "열망하는, 열의에 찬", ex: "The man was eager to talk about the good news.", q: "[Ex 1-A-5] feeling worried (a. consisting of / b. load / c. polite / d. anxious) [정답: d. anxious]" },
      { word: "household", pos: "n.", kor: "가정, 가구", ex: "Our household is made up of my father, my mother and me.", q: "[Ex 1-B-1] possess (a. to look for / b. to own / c. to pick up / d. to put in) [정답: b. to own]" },
      { word: "intent", pos: "n.", kor: "의도, 목적", ex: "Her intent is to visit Italy next summer.", q: "[Ex 1-B-2] desire (a. to want / b. to make up of / c. to have / d. to say) [정답: a. to want]" },
      { word: "landscape", pos: "n.", kor: "풍경, 경치", ex: "The landscape of the country is very green.", q: "[Ex 1-B-3] intent (a. an area of land / b. an organ / c. a plan / d. a feeling) [정답: c. a plan]" },
      { word: "lift", pos: "v.", kor: "들어올리다", ex: "The man tried to lift the box.", q: "[Ex 1-B-4] shine (a. to learn / b. to make light / c. to have something fall out / d. to move fast) [정답: b. to make light]" },
      { word: "load", pos: "v.", kor: "(짐을) 싣다", ex: "The man loaded the boxes into a truck.", q: "[Ex 1-B-5] polite (a. thoughtful / b. worried / c. fast / d. excited) [정답: a. thoughtful]" },
      { word: "lung", pos: "n.", kor: "폐, 허파", ex: "Having strong lungs is necessary for a healthy life.", q: "[Ex 2-1] (a) It is hard to seek for things when it is sunny. / (b) A landscape may have snow during the winter. [정답: b]" },
      { word: "motion", pos: "n.", kor: "동작, 몸짓", ex: "The police officer made a motion with his hand.", q: "[Ex 2-2] (a) Most children are eager to get gifts. / (b) Good friends are awful to have around. [정답: a]" },
      { word: "pace", pos: "n.", kor: "속도, 걸음", ex: "I ran the race at a slower pace than my friend.", q: "[Ex 2-3] (a) The lungs help move blood through the body. / (b) People may feel anxious when they give a speech. [정답: b]" },
      { word: "polite", pos: "adj.", kor: "예의 바른, 공손한", ex: "The boy was very polite: he behaved very thoughtfully.", q: "[Ex 2-4] (a) It isn't polite to take things without asking first. / (b) You should help spill the dishes after dinner. [정답: a]" },
      { word: "possess", pos: "v.", kor: "소유하다, 지니다", ex: "My uncle possesses three sheep, a chicken, a cow and a dog.", q: "[Ex 2-5] (a) If you work at a fast pace, things will get done quickly. / (b) It is important to lift your notes before a test. [정답: a]" },
      { word: "rapidly", pos: "adv.", kor: "빨리, 급속히", ex: "The train moved rapidly on the tracks.", q: "[Ex 2-6] (a) People are eager to leave when they don't want to go anywhere. / (b) You should get help when lifting heavy boxes. [정답: b]" },
      { word: "remark", pos: "v.", kor: "말하다, 언급하다", ex: "The teacher remarked on how quickly the students were learning.", q: "[Ex 2-7] (a) Some people live in the landscape while others live in the city. / (b) Everyone has awful days where nothing goes right. [정답: b]" },
      { word: "seek", pos: "v.", kor: "찾다, 구하다", ex: "If I have a problem, I seek my sister's advice.", q: "[Ex 2-8] (a) It is good to seek advice when you have a problem. / (b) Students feel anxious when they get good grades. [정답: a]" },
      { word: "shine", pos: "v.", kor: "빛나다, 비추다", ex: "The candles are shining in the dark room.", q: "[Ex 2-9] (a) When you breathe, air goes into your lungs. / (b) Some students pace to school every day. [정답: a]" },
      { word: "spill", pos: "v.", kor: "흘리다, 쏟다", ex: "I spilled the coffee on the table.", q: "[Ex 2-10] (a) Polite people do not say 'please' or 'thank you.' / (b) When you spill something, you should clean it up right away. [정답: b]" }
    ],
    storySentences: [
      { en: "An awful woman lived with her daughter and stepdaughter in her household.", ko: "한 끔찍한 여자가 자신의 집에서 딸과 의붓딸과 함께 살고 있었습니다." },
      { en: "She possessed feelings of hate for her stepdaughter, Anna.", ko: "그녀는 의붓딸 안나에 대해 증오심을 품고 있었습니다." },
      { en: "Anna worked while her stepsister did nothing.", ko: "의붓언니는 아무것도 하지 않는 동안 안나는 일만 했습니다." },
      { en: "On a cold January night, Anna's stepmother remarked, 'Your stepsister desires flowers.'", ko: "어느 추운 1월 밤, 안나의 계모가 말했습니다, '네 언니가 꽃을 원한단다.'" },
      { en: "'Go and find some.'", ko: "'가서 좀 찾아오너라.'" },
      { en: "Anna wasn't anxious to walk through the chilled landscape.", ko: "안나는 몹시 추운 풍경 속을 걷고 싶어 하지 않았습니다." },
      { en: "The cold air made her lungs burn.", ko: "차가운 공기에 폐가 타들어 가는 것 같았습니다." },
      { en: "She walked at a slow pace because of the snow.", ko: "눈 때문에 그녀는 느린 걸음으로 걸었습니다." },
      { en: "Soon she saw a group of people.", ko: "곧 그녀는 한 무리의 사람들을 보았습니다." },
      { en: "It consisted of twelve men.", ko: "그들은 열두 명의 남자들로 이루어져 있었습니다." },
      { en: "Anna told them about the flowers.", ko: "안나는 그들에게 꽃에 관해 이야기했습니다." },
      { en: "One of the man said they were the twelve months and that they would help Anna.", ko: "남자들 중 한 명이 자신들이 12개의 달이며 안나를 도와주겠다고 말했습니다." },
      { en: "January walked to her and made a motion with his hand.", ko: "1월이 그녀에게 걸어와 손짓을 했습니다." },
      { en: "The days of the month passed rapidly until it was February's turn.", ko: "그 달의 날들이 빠르게 지나가 2월의 차례가 되었습니다." },
      { en: "February also made the month speed up.", ko: "2월 역시 달의 속도를 빠르게 했습니다." },
      { en: "Then March made the sun shine and flowers grew in the field.", ko: "그러자 3월이 태양을 빛나게 했고 들판에 꽃들이 피어났습니다." },
      { en: "Anna loaded her basket with so many flowers that she could hardly lift it.", ko: "안나는 바구니를 들기 힘들 정도로 많은 꽃을 가득 실었습니다." },
      { en: "Then she gave a quick but polite 'thank you' to the twelve men and returned home.", ko: "그리고 나서 그녀는 12명의 남자들에게 짧지만 공손한 감사의 인사를 전하고 집으로 돌아왔습니다." },
      { en: "She was very eager to show her stepmother all the flowers.", ko: "그녀는 계모에게 그 모든 꽃들을 보여주고 싶어 안달이 났습니다." },
      { en: "Back at the house, she spilled the flowers onto the table.", ko: "집으로 돌아와 그녀는 꽃들을 테이블 위에 쏟아 놓았습니다." },
      { en: "Then she told her stepmother about the twelve men.", ko: "그리고 계모에게 12명의 남자들에 대해 이야기했습니다." },
      { en: "Anna's stepmother and stepsister went to seek the twelve months.", ko: "안나의 계모와 의붓언니는 12개의 달을 찾으러 떠났습니다." },
      { en: "Their intent was to ask for gifts.", ko: "그들의 목적은 선물을 요구하는 것이었습니다." },
      { en: "They looked and looked.", ko: "그들은 찾고 또 찾았습니다." },
      { en: "They became very lost and never found their way home.", ko: "그들은 완전히 길을 잃었고 다시는 집으로 돌아오는 길을 찾지 못했습니다." },
      { en: "Anna lived happily by herself.", ko: "안나는 홀로 행복하게 살았습니다." }
    ],
    readingQuestions: [
      { q: "What is the story about?", options: ["Why a year consists of twelve months", "How a girl made the sun shine in winter", "Why moving at a slow pace is good", "How the months helped a polite girl"], answer: "d. How the months helped a polite girl" },
      { q: "Why did Anna need to seek flowers?", options: ["Her stepmother remarked that she liked them.", "Her awful stepsister desired them for her birthday.", "She spilled the ones she already possessed.", "She was eager to please her stepmother."], answer: "d. She was eager to please her stepmother." },
      { q: "In paragraph 4 we can infer that", options: ["the months rapidly helped Anna load her basket", "Anna asked the months to live in her household", "Anna's awful stepmother and stepsister never found the months", "Anna got lost going across the dark landscape on her way home"], answer: "c. Anna's awful stepmother and stepsister never found the months" },
      { q: "According to the passage, all the following are true EXCEPT", options: ["the cold air hurt Anna's lungs", "Anna's stepmother lifted the basket", "January made a motion to speed up time", "Anna wasn't anxious to go out in the cold, dark night"], answer: "b. Anna's stepmother lifted the basket" },
      { q: "What was Anna's stepmother's and stepsister's intent when they left?", options: ["Their intent was to ask for gifts."], answer: "Their intent was to ask for gifts." }
    ]
  }
];
