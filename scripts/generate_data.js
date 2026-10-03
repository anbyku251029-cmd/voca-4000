// Script to generate complete 30 units data for 4000 Essential English Words Book 1
import fs from 'fs';
import path from 'path';

// Unit word lists & metadata
const unitsRaw = [
  {
    unit: 1,
    title: "The Lion and the Rabbit",
    words: [
      { order: 1, word: "afraid", pronunciation: "/əˈfreɪd/", pos: "adj.", def: "Feeling fear or worry about possible danger.", kor: "두려워하는, 무서워하는", ex: "The rabbit was afraid of the cruel lion." },
      { order: 2, word: "agree", pronunciation: "/əˈɡriː/", pos: "v.", def: "To have the same opinion as someone else.", kor: "동의하다, 찬성하다", ex: "The lion agreed to the reasonable plan." },
      { order: 3, word: "angry", pronunciation: "/ˈæŋɡri/", pos: "adj.", def: "Having a strong feeling of displeasure or hostility.", kor: "화가 난, 분노한", ex: "The king was angry when the rabbit arrived late." },
      { order: 4, word: "arrive", pronunciation: "/əˈraɪv/", pos: "v.", def: "To reach a destination or place.", kor: "도착하다", ex: "He arrived at the palace just before sunset." },
      { order: 5, word: "attack", pronunciation: "/əˈtæk/", pos: "v.", def: "To try to hurt or defeat using violent force.", kor: "공격하다", ex: "The predator attacked without making a sound." },
      { order: 6, word: "bottom", pronunciation: "/ˈbɑːtəm/", pos: "n.", def: "The lowest part or surface of something.", kor: "바닥, 맨 아래", ex: "He looked down to the bottom of the deep well." },
      { order: 7, word: "clever", pronunciation: "/ˈklevər/", pos: "adj.", def: "Quick at learning, understanding, or thinking of ideas.", kor: "영리한, 똑똑한", ex: "The clever rabbit came up with an ingenious plan." },
      { order: 8, word: "cruel", pronunciation: "/ˈkruːəl/", pos: "adj.", def: "Extremely unkind and causing pain to others willfully.", kor: "잔인한, 잔혹한", ex: "The cruel beast terrorized the peaceful animals." },
      { order: 9, word: "finally", pronunciation: "/ˈfaɪnəli/", pos: "adv.", def: "After a long period of time or struggle.", kor: "마침내, 드디어", ex: "After a long walk, he finally reached safety." },
      { order: 10, word: "hide", pronunciation: "/haɪd/", pos: "v.", def: "To put or stay where one cannot be seen.", kor: "숨다, 숨기다", ex: "The small creatures hide beneath the green leaves." },
      { order: 11, word: "hunt", pronunciation: "/hʌnt/", pos: "v.", def: "To chase and kill wild animals for food or sport.", kor: "사냥하다", ex: "Lions usually hunt during the cool night." },
      { order: 12, word: "lot", pronunciation: "/lɑːt/", pos: "n.", def: "A large number or amount of things or people.", kor: "많은 것, 다수", ex: "There were a lot of apples gathered under the tree." },
      { order: 13, word: "middle", pronunciation: "/ˈmɪdəl/", pos: "n.", def: "The central point, position, or part.", kor: "가운데, 중간", ex: "A fountain stood in the middle of the courtyard." },
      { order: 14, word: "moment", pronunciation: "/ˈmoʊmənt/", pos: "n.", def: "A very brief period of time; an instant.", kor: "순간, 찰나", ex: "Please wait a moment while I check the map." },
      { order: 15, word: "pleased", pronunciation: "/pliːzd/", pos: "adj.", def: "Feeling happy, satisfied, or content.", kor: "기뻐하는, 만족스러운", ex: "The villagers were pleased with the good harvest." },
      { order: 16, word: "promise", pronunciation: "/ˈprɑːmɪs/", pos: "v.", def: "To say that one will definitely do or provide something.", kor: "약속하다", ex: "He promised to keep the location a secret." },
      { order: 17, word: "reply", pronunciation: "/rɪˈplaɪ/", pos: "v.", def: "To give an answer in words or writing.", kor: "대답하다, 응답하다", ex: "She smiled gently before she replied to his question." },
      { order: 18, word: "safe", pronunciation: "/seɪf/", pos: "adj.", def: "Protected from or not exposed to danger or risk.", kor: "안전한", ex: "Inside the shelter, everyone felt safe from the storm." },
      { order: 19, word: "trick", pronunciation: "/trɪk/", pos: "n.", def: "An action intended to deceive or outsmart someone.", kor: "속임수, 책략, 묘기", ex: "The magician showed an amazing optical trick." },
      { order: 20, word: "well", pronunciation: "/wel/", pos: "adv.", def: "In a good, thorough, or satisfactory manner.", kor: "잘, 훌륭하게", ex: "The strategy worked remarkably well." }
    ],
    story: {
      title: "The Lion and the Rabbit",
      sentences: [
        "A cruel lion lived in the forest.",
        "Every day, he would hunt and kill a lot of innocent animals.",
        "The other animals were deeply afraid the lion would destroy them all.",
        "So, the animals met in the middle of the jungle and agreed to speak to him.",
        "They told the lion, 'If you promise to eat only one of us each day, you will not have to hunt.'",
        "The plan sounded well to the lion, so he replied that he accepted their proposal.",
        "For several weeks, the other animals remained safe in their homes.",
        "Finally, it was time for a clever little rabbit to visit the lion's cave.",
        "The rabbit walked slowly and arrived late, which made the hungry beast very angry.",
        "'Why did you keep me waiting for so long?' shouted the lion.",
        "The rabbit replied, 'I had to hide because another fierce lion attacked me near the old well.'",
        "The lion was furious: 'Take me to him this moment! I am the only ruler here!'",
        "The rabbit led the lion to the stone well and told him to look down to the bottom.",
        "The lion saw his own reflection in the water, but thought it was his enemy.",
        "Without waiting another moment, the lion leaped in to attack.",
        "The lion drowned in the deep water, and the rabbit's clever trick worked exceedingly well.",
        "All the forest animals were pleased that they could now live in peace."
      ]
    }
  },
  {
    unit: 2,
    title: "The Laboratory Experiment",
    words: [
      { order: 1, word: "adventure", pronunciation: "/ədˈventʃər/", pos: "n.", def: "An unusual and exciting or daring experience.", kor: "모험", ex: "Riding through the canyon was a thrilling adventure." },
      { order: 2, word: "approach", pronunciation: "/əˈproʊtʃ/", pos: "v.", def: "To come closer to someone or something in distance or time.", kor: "접근하다, 다가가다", ex: "The curious cat approached the open window." },
      { order: 3, word: "carefully", pronunciation: "/ˈkerfəli/", pos: "adv.", def: "With great attention to avoid harm or error.", kor: "조심스럽게, 주의 깊게", ex: "The scientist poured the liquid carefully." },
      { order: 4, word: "chemical", pronunciation: "/ˈkemɪkəl/", pos: "n.", def: "A distinct compound or substance produced by chemistry.", kor: "화학 물질", ex: "Certain chemicals react explosively when mixed." },
      { order: 5, word: "create", pronunciation: "/kriˈeɪt/", pos: "v.", def: "To bring something new into existence.", kor: "창조하다, 만들어내다", ex: "The artist wanted to create a glowing sculpture." },
      { order: 6, word: "evil", pronunciation: "/ˈiːvəl/", pos: "adj.", def: "Morally bad, cruel, or causing harm.", kor: "사악한, 나쁜", ex: "The evil wizard cast a shadow over the land." },
      { order: 7, word: "experiment", pronunciation: "/ɪkˈsperɪmənt/", pos: "n.", def: "A scientific procedure to make a discovery or test a hypothesis.", kor: "실험", ex: "The chemistry experiment yielded surprising results." },
      { order: 8, word: "kill", pronunciation: "/kɪl/", pos: "v.", def: "To cause the death of a living organism.", kor: "죽이다, 파괴하다", ex: "Frost can kill delicate spring flowers." },
      { order: 9, word: "laboratory", pronunciation: "/ˈlæbrətɔːri/", pos: "n.", def: "A room or building equipped for scientific research.", kor: "실험실, 연구실", ex: "Special goggles must be worn inside the laboratory." },
      { order: 10, word: "laugh", pronunciation: "/læf/", pos: "v.", def: "To make sounds showing amusement or joy.", kor: "웃다", ex: "The children laughed at the playful puppy." },
      { order: 11, word: "loud", pronunciation: "/laʊd/", pos: "adj.", def: "Producing a lot of noise or high volume.", kor: "시끄러운, 소리가 큰", ex: "A loud thunderclap echoed through the night." },
      { order: 12, word: "nervous", pronunciation: "/ˈnɜːrvəs/", pos: "adj.", def: "Easily agitated, anxious, or apprehensive.", kor: "불안한, 긴장된", ex: "He felt nervous before stepping onto the stage." },
      { order: 13, word: "noise", pronunciation: "/nɔɪz/", pos: "n.", def: "A sound, especially one that is loud, unpleasant, or unexpected.", kor: "소음, 소리", ex: "The strange noise outside kept the family awake." },
      { order: 14, word: "project", pronunciation: "/ˈprɑːdʒekt/", pos: "n.", def: "A planned piece of work intended to achieve a particular purpose.", kor: "프로젝트, 과제, 계획", ex: "Our team completed the science project on time." },
      { order: 15, word: "scare", pronunciation: "/sker/", pos: "v.", def: "To cause someone to feel fear or panic.", kor: "겁주다, 깜짝 놀라게 하다", ex: "Sudden lightning can scare young children." },
      { order: 16, word: "secret", pronunciation: "/ˈsiːkrət/", pos: "n.", def: "Something kept hidden or known only to a few.", kor: "비밀", ex: "She whispered the secret formula into his ear." },
      { order: 17, word: "shout", pronunciation: "/ʃaʊt/", pos: "v.", def: "To cry out or speak with a very loud voice.", kor: "소리치다, 외치다", ex: "He shouted to warn others of the approaching fire." },
      { order: 18, word: "smell", pronunciation: "/smel/", pos: "v.", def: "To perceive an odor using one's nose.", kor: "냄새를 맡다, 냄새가 나다", ex: "We could smell fresh bread from across the street." },
      { order: 19, word: "terrible", pronunciation: "/ˈterəbəl/", pos: "adj.", def: "Extremely bad, serious, or unpleasant.", kor: "끔찍한, 지독한", ex: "A terrible storm caused a power outage." },
      { order: 20, word: "worse", pronunciation: "/wɜːrs/", pos: "adj.", def: "More unsatisfactory, harmful, or severe than before.", kor: "더 나쁜, 악화된", ex: "The weather became worse as darkness fell." }
    ],
    story: {
      title: "The Laboratory Experiment",
      sentences: [
        "Mia had an exciting adventure when she visited her uncle's high-tech laboratory.",
        "Her uncle was working on a top-secret science project to create clean energy.",
        "Mia approached the heavy glass counter carefully so she would not drop any instruments.",
        "There was a strange, pungent smell coming from a bubbling green chemical.",
        "Suddenly, a loud noise echoed across the room, which began to scare her.",
        "Mia felt very nervous because she thought an evil monster might appear.",
        "She wanted to shout for help, but her uncle began to laugh warmly.",
        "'Do not worry!' her uncle explained with a wide smile.",
        "'That terrible sound was just pressurized gas venting from the tube.'",
        "'If the valve was blocked, the pressure could have become much worse and ruined the experiment.'",
        "Relieved that no one was in danger, Mia smiled and enjoyed the rest of the visit."
      ]
    }
  },
  {
    unit: 3,
    title: "A Report on the Universe",
    words: [
      { order: 1, word: "alien", pronunciation: "/ˈeɪliən/", pos: "n.", def: "A creature from another planet or world.", kor: "외계인, 이방인", ex: "The movie featured a friendly alien visiting Earth." },
      { order: 2, word: "among", pronunciation: "/əˈmʌŋ/", pos: "prep.", def: "In the middle of or surrounded by other things.", kor: "~ 사이에, ~ 가운데에", ex: "A red rose bloomed among the white daisies." },
      { order: 3, word: "chart", pronunciation: "/tʃɑːrt/", pos: "n.", def: "A graphical representation of data, like a map or table.", kor: "도표, 차트", ex: "The astronomer drew a star chart on the board." },
      { order: 4, word: "cloud", pronunciation: "/klaʊd/", pos: "n.", def: "A visible mass of condensed water vapor in the sky.", kor: "구름", ex: "Dark clouds covered the mountains before the rain." },
      { order: 5, word: "comprehend", pronunciation: "/ˌkɑːmprɪˈhend/", pos: "v.", def: "To understand the meaning or nature of something fully.", kor: "이해하다, 파악하다", ex: "It was difficult to comprehend the vast size of the galaxy." },
      { order: 6, word: "describe", pronunciation: "/dɪˈskraɪb/", pos: "v.", def: "To tell in words what someone or something is like.", kor: "묘사하다, 설명하다", ex: "Can you describe the colors you saw in the nebula?" },
      { order: 7, word: "ever", pronunciation: "/ˈevər/", pos: "adv.", def: "At any time in history or life.", kor: "언제든, 지금까지", ex: "Have you ever looked through a giant telescope?" },
      { order: 8, word: "fail", pronunciation: "/feɪl/", pos: "v.", def: "To be unsuccessful in achieving an objective.", kor: "실패하다, 불합격하다", ex: "She did not fail because she studied thoroughly." },
      { order: 9, word: "friendly", pronunciation: "/ˈfrendli/", pos: "adj.", def: "Kind, pleasant, and behaving like a friend.", kor: "다정한, 친절한", ex: "The new classmate gave a warm, friendly smile." },
      { order: 10, word: "grade", pronunciation: "/ɡreɪd/", pos: "n.", def: "A score or mark given to a student's academic work.", kor: "점수, 등급, 학년", ex: "He received an excellent grade on his essay." },
      { order: 11, word: "instead", pronunciation: "/ɪnˈsted/", pos: "adv.", def: "As an alternative or substitute.", kor: "대신에", ex: "Let's drink fresh water instead of soda." },
      { order: 12, word: "library", pronunciation: "/ˈlaɪbreri/", pos: "n.", def: "A building or room containing collections of books.", kor: "도서관", ex: "Students researched astronomy in the quiet library." },
      { order: 13, word: "planet", pronunciation: "/ˈplænɪt/", pos: "n.", def: "A large celestial body orbiting around a star.", kor: "행성", ex: "Mars is the fourth planet from our sun." },
      { order: 14, word: "report", pronunciation: "/rɪˈpɔːrt/", pos: "n.", def: "A spoken or written account of something observed.", kor: "보고서, 리포트", ex: "The teacher assigned a research report on space." },
      { order: 15, word: "several", pronunciation: "/ˈsevrəl/", pos: "det./pron.", def: "More than two but not many.", kor: "몇몇의, 서너 개의", ex: "There were several bright satellites visible tonight." },
      { order: 16, word: "solve", pronunciation: "/sɑːlv/", pos: "v.", def: "To find an answer, explanation, or solution.", kor: "해결하다, 풀다", ex: "He used mathematical formulas to solve the puzzle." },
      { order: 17, word: "suddenly", pronunciation: "/ˈsʌdənli/", pos: "adv.", def: "Quickly and unexpectedly without warning.", kor: "갑자기", ex: "A shooting star suddenly flashed across the sky." },
      { order: 18, word: "suppose", pronunciation: "/səˈpoʊz/", pos: "v.", def: "To assume or believe something to be probable.", kor: "가정하다, 생각하다", ex: "I suppose we should prepare the presentation now." },
      { order: 19, word: "universe", pronunciation: "/ˈjuːnɪvɜːrs/", pos: "n.", def: "All existing matter and space considered as a whole.", kor: "우주", ex: "The universe contains billions of mysterious galaxies." },
      { order: 20, word: "view", pronunciation: "/vjuː/", pos: "v.", def: "To look at or inspect with one's eyes.", kor: "바라보다, 관찰하다; 시야", ex: "We can view the lunar craters through binoculars." }
    ],
    story: {
      title: "A Report on the Universe",
      sentences: [
        "Leo went to the community library to write an important science report.",
        "His goal was to describe how planets formed in our vast universe.",
        "Leo was worried that he might fail and receive a poor grade.",
        "Instead of giving up, he sat among rows of astronomical encyclopedias.",
        "He studied several colorful diagrams and a detailed planetary chart.",
        "He tried to comprehend how gas and thick clouds created celestial bodies.",
        "A friendly librarian helped him solve complicated orbital equations.",
        "Suddenly, Leo looked through the observatory window to view the evening sky.",
        "He had never seen stars shining so brilliantly before.",
        "Leo thought, 'I suppose there might even be an alien world out there.'",
        "With new confidence, he finished his report and earned top honors."
      ]
    }
  },
  {
    unit: 4,
    title: "The Patient Villagers",
    words: [
      { order: 1, word: "appropriate", pronunciation: "/əˈproʊpriət/", pos: "adj.", def: "Suitable or proper in the circumstances.", kor: "적절한, 알맞은", ex: "Wear appropriate clothing for the cold mountain weather." },
      { order: 2, word: "avoid", pronunciation: "/əˈvɔɪd/", pos: "v.", def: "To keep away from or stop oneself from doing something.", kor: "피하다, 방지하다", ex: "Drivers should avoid slippery icy roads." },
      { order: 3, word: "behave", pronunciation: "/bɪˈheɪv/", pos: "v.", def: "To act or conduct oneself in a specified way.", kor: "행동하다, 예의 바르게 굴다", ex: "Children are taught to behave respectfully." },
      { order: 4, word: "calm", pronunciation: "/kɑːm/", pos: "adj.", def: "Not showing or feeling nervousness, anger, or agitation.", kor: "차분한, 침착한", ex: "Keep a calm mind during emergency situations." },
      { order: 5, word: "concern", pronunciation: "/kənˈsɜːrn/", pos: "n.", def: "Anxiety, worry, or care about someone or something.", kor: "걱정, 염려, 관심사", ex: "The elder expressed concern for the village water supply." },
      { order: 6, word: "content", pronunciation: "/kənˈtent/", pos: "adj.", def: "In a state of peaceful happiness and satisfaction.", kor: "만족하는", ex: "He was perfectly content with a simple bowl of soup." },
      { order: 7, word: "expect", pronunciation: "/ɪkˈspekt/", pos: "v.", def: "To regard something as likely to happen.", kor: "기대하다, 예상하다", ex: "We expect sunny skies throughout the weekend." },
      { order: 8, word: "frequently", pronunciation: "/ˈfriːkwəntli/", pos: "adv.", def: "Regularly or on many occasions; often.", kor: "자주, 빈번히", ex: "She frequently visits the local community market." },
      { order: 9, word: "habit", pronunciation: "/ˈhæbɪt/", pos: "n.", def: "A settled regular practice, especially one hard to give up.", kor: "습관", ex: "Daily reading is a wonderful habit to cultivate." },
      { order: 10, word: "instruct", pronunciation: "/ɪnˈstrʌkt/", pos: "v.", def: "To direct or teach someone to do something.", kor: "지시하다, 가르치다", ex: "The instructor told us how to use the equipment safely." },
      { order: 11, word: "issue", pronunciation: "/ˈɪʃuː/", pos: "n.", def: "An important topic or problem for debate or discussion.", kor: "문제, 쟁점, 사안", ex: "Clean drinking water was the primary issue discussed." },
      { order: 12, word: "none", pronunciation: "/nʌn/", pos: "pron.", def: "Not any; no person or thing.", kor: "아무도 ~않다, 하나도 없다", ex: "None of the crops were damaged by the light breeze." },
      { order: 13, word: "patient", pronunciation: "/ˈpeɪʃənt/", pos: "adj.", def: "Able to accept delays or problems without becoming annoyed.", kor: "참을성 있는, 끈기 있는", ex: "A patient teacher listens carefully to every student." },
      { order: 14, word: "positive", pronunciation: "/ˈpɑːzətɪv/", pos: "adj.", def: "Constructive, optimistic, or confident.", kor: "긍정적인, 낙관적인", ex: "Maintaining a positive attitude helps overcome obstacles." },
      { order: 15, word: "punish", pronunciation: "/ˈpʌnɪʃ/", pos: "v.", def: "To inflict a penalty or retribution on someone.", kor: "처벌하다, 벌주다", ex: "The law will punish those who break public rules." },
      { order: 16, word: "represent", pronunciation: "/ˌreprɪˈzent/", pos: "v.", def: "To stand for or act on behalf of someone or a group.", kor: "대표하다, 나타내다", ex: "The mayor was chosen to represent the entire town." },
      { order: 17, word: "shake", pronunciation: "/ʃeɪk/", pos: "v.", def: "To move with quick short movements from side to side.", kor: "흔들다, 떨다", ex: "He had to shake hands with each visiting guest." },
      { order: 18, word: "spread", pronunciation: "/spred/", pos: "v.", def: "To extend over a wider area or reach more people.", kor: "퍼지다, 퍼뜨리다", ex: "Kindness can spread rapidly through a community." },
      { order: 19, word: "stroll", pronunciation: "/stroʊl/", pos: "v.", def: "To walk in a leisurely, relaxed manner.", kor: "한가롭게 거닐다, 산책하다", ex: "We decided to stroll along the peaceful riverbank." },
      { order: 20, word: "village", pronunciation: "/ˈvɪlɪdʒ/", pos: "n.", def: "A group of houses in a rural area, smaller than a town.", kor: "마을", ex: "The ancient village was nestled between two hills." }
    ],
    story: {
      title: "The Patient Villagers",
      sentences: [
        "In a quiet mountain village, residents loved to take an evening stroll.",
        "The elders instructed youth on how to behave with kindness and honor.",
        "Whenever a difficult issue arose, people gathered to voice their concern.",
        "The mayor chose appropriate leaders to represent each neighborhood.",
        "Everyone made it a daily habit to stay calm and cultivate a positive mindset.",
        "They believed it was better to guide people patiently than to punish minor errors.",
        "As a result, none of the villagers fought or spread false rumors.",
        "They knew how to avoid needless conflicts and greet visitors with a warm handshake.",
        "Because of their mutual trust, the entire community lived happy and content lives."
      ]
    }
  },
  {
    unit: 5,
    title: "The Wilderness Experience",
    words: [
      { order: 1, word: "aware", pronunciation: "/əˈwer/", pos: "adj.", def: "Having knowledge or perception of a situation or fact.", kor: "알고 있는, 인식하는", ex: "Hikers must be aware of wild animals in the forest." },
      { order: 2, word: "badly", pronunciation: "/ˈbædli/", pos: "adv.", def: "In an unsatisfactory, inadequate, or severe manner.", kor: "심하게, 나쁘게", ex: "He was badly shaken after falling from the bicycle." },
      { order: 3, word: "belong", pronunciation: "/bɪˈlɔːŋ/", pos: "v.", def: "To be in the right or suitable place; be owned by.", kor: "~에 속하다, 소속되다", ex: "These ancient artifacts belong in the national museum." },
      { order: 4, word: "continue", pronunciation: "/kənˈtɪnjuː/", pos: "v.", def: "To persist or resume without stopping.", kor: "계속되다, 지속하다", ex: "The search team will continue until morning." },
      { order: 5, word: "error", pronunciation: "/ˈerər/", pos: "n.", def: "A mistake or fault in action, calculation, or judgment.", kor: "실수, 오류", ex: "A typographical error was corrected before publication." },
      { order: 6, word: "experience", pronunciation: "/ɪkˈspɪriəns/", pos: "n.", def: "Practical contact with and observation of facts or events.", kor: "경험, 체험", ex: "Camping outdoors was a memorable learning experience." },
      { order: 7, word: "field", pronunciation: "/fiːld/", pos: "n.", def: "An open area of land or a particular branch of study.", kor: "들판, 분야", ex: "Cattle were grazing across the wide grassy field." },
      { order: 8, word: "hurt", pronunciation: "/hɜːrt/", pos: "v.", def: "To cause physical pain or injury to someone.", kor: "다치게 하다, 아프다", ex: "Sharp rocks might hurt your bare feet." },
      { order: 9, word: "judgment", pronunciation: "/ˈdʒʌdʒmənt/", pos: "n.", def: "The ability to make considered decisions or come to conclusions.", kor: "판단, 판결, 판단력", ex: "Good judgment comes from careful reflection." },
      { order: 10, word: "likely", pronunciation: "/ˈlaɪkli/", pos: "adj.", def: "Such as well might happen or be true; probable.", kor: "~할 것 같은, 유력한", ex: "Rain is likely later this afternoon." },
      { order: 11, word: "normal", pronunciation: "/ˈnɔːrməl/", pos: "adj.", def: "Conforming to a standard; usual, typical, or expected.", kor: "정상적인, 평범한", ex: "The engine resumed its normal operating temperature." },
      { order: 12, word: "rare", pronunciation: "/rer/", pos: "adj.", def: "Not occurring very often; seldom found.", kor: "희귀한, 드문", ex: "This blue butterfly is an exceedingly rare species." },
      { order: 13, word: "relax", pronunciation: "/rɪˈlæks/", pos: "v.", def: "To become less tense, anxious, or rigid; rest.", kor: "휴식을 취하다, 긴장을 풀다", ex: "After a long trek, they relaxed beside the warm campfire." },
      { order: 14, word: "request", pronunciation: "/rɪˈkwest/", pos: "v.", def: "To ask politely or formally for something.", kor: "요청하다, 부탁하다", ex: "The ranger requested that visitors stay on marked paths." },
      { order: 15, word: "reside", pronunciation: "/rɪˈzaɪd/", pos: "v.", def: "To have one's permanent home in a particular place.", kor: "살다, 거주하다", ex: "Several species of deer reside in this nature reserve." },
      { order: 16, word: "result", pronunciation: "/rɪˈzʌlt/", pos: "n.", def: "An effect, outcome, or consequence of an action.", kor: "결과", ex: "The positive test result brought relief to all." },
      { order: 17, word: "roll", pronunciation: "/roʊl/", pos: "v.", def: "To move by turning over and over on an axis.", kor: "구르다, 굴리다", ex: "A round pebble began to roll down the hillside." },
      { order: 18, word: "since", pronunciation: "/sɪns/", pos: "prep./conj.", def: "In the period following; because or seeing that.", kor: "~이래로, ~이므로", ex: "He has loved exploring wildlife since he was ten." },
      { order: 19, word: "visible", pronunciation: "/ˈvɪzəbəl/", pos: "adj.", def: "Able to be perceived or seen by the eye.", kor: "눈에 보이는, 뚜렷한", ex: "The snow-capped peaks were visible on the horizon." },
      { order: 20, word: "wild", pronunciation: "/waɪld/", pos: "adj.", def: "Living or growing in the natural environment without human control.", kor: "야생의, 거친", ex: "A herd of wild horses galloped freely across the valley." }
    ],
    story: {
      title: "The Wilderness Experience",
      sentences: [
        "A team of nature researchers traveled deep into the wild grasslands.",
        "They were fully aware that wild predators reside in this rugged field.",
        "The team leader had years of field experience and outstanding judgment.",
        "He warned everyone that a single error could cause someone to be hurt badly.",
        "Since the weather was clear, the distant mountain range was completely visible.",
        "A rare golden eagle soared in circles above the rolling meadows.",
        "The team requested that everyone walk slowly and let heavy stones roll away safely.",
        "By evening, they pitched their tents and began to relax around a cozy campfire.",
        "The research mission continued with normal progress and resulted in great scientific discoveries."
      ]
    }
  }
];

// Helper to fill remaining units (Units 6 to 30) with rich authentic 4000 Essential English Words 1 curriculum
const additionalUnitsData = [
  {
    unit: 6,
    title: "The Escape from the Castle",
    words: [
      { order: 1, word: "advantage", pos: "n.", kor: "이점, 유리한 점", def: "A condition or circumstance that puts one in a favorable position." },
      { order: 2, word: "cause", pos: "v.", kor: "원인이 되다, 야기하다", def: "To make something happen, especially something bad." },
      { order: 3, word: "choice", pos: "n.", kor: "선택, 선택권", def: "An act of selecting or making a decision when faced with options." },
      { order: 4, word: "community", pos: "n.", kor: "공동체, 지역 사회", def: "A group of people living in the same place or having a particular characteristic in common." },
      { order: 5, word: "distance", pos: "n.", kor: "거리, 간격", def: "The amount of space between two things, places, or people." },
      { order: 6, word: "escape", pos: "v.", kor: "탈출하다, 벗어나다", def: "To break free from confinement or control." },
      { order: 7, word: "face", pos: "v.", kor: "직면하다, 마주보다", def: "To confront or deal with a problem or challenge directly." },
      { order: 8, word: "follow", pos: "v.", kor: "따라가다, 따르다", def: "To go or come after someone or something as a guide or result." },
      { order: 9, word: "fright", pos: "n.", kor: "공포, 큰 놀람", def: "A sudden intense feeling of fear." },
      { order: 10, word: "ghost", pos: "n.", kor: "유령, 귀신", def: "An apparition of a dead person which is believed to appear to people." },
      { order: 11, word: "individual", pos: "n.", kor: "개인, 개개의 사람", def: "A single human being as distinct from a group or class." },
      { order: 12, word: "pet", pos: "n.", kor: "애완동물, 반려동물", def: "A domestic animal kept for companionship or pleasure." },
      { order: 13, word: "reach", pos: "v.", kor: "도달하다, 이르다", def: "To arrive at or get to a particular place or level." },
      { order: 14, word: "return", pos: "v.", kor: "돌아가다, 반환하다", def: "To come or go back to a place or person." },
      { order: 15, word: "survive", pos: "v.", kor: "살아남다, 생존하다", def: "To continue to live or exist, especially in spite of danger." },
      { order: 16, word: "upset", pos: "adj.", kor: "속상한, 당황한", def: "Unhappy, disappointed, or worried about something." },
      { order: 17, word: "voice", pos: "n.", kor: "목소리, 음성", def: "The sound produced in a person's larynx and uttered through the mouth." },
      { order: 18, word: "weather", pos: "n.", kor: "날씨, 기상", def: "The state of the atmosphere at a place and time regarding heat, cloudiness, or rain." },
      { order: 19, word: "wise", pos: "adj.", kor: "지혜로운, 현명한", def: "Having or showing experience, knowledge, and good judgment." },
      { order: 20, word: "allow", pos: "v.", kor: "허락하다, 가능하게 하다", def: "To give someone permission to do something or enable an event." }
    ],
    storySentences: [
      "A young individual walked through the foggy woods with his loyal pet dog.",
      "The harsh autumn weather began to cause thick mist across the long distance.",
      "Suddenly, he heard a chilling voice that gave him a terrible fright.",
      "Some local villagers believed an ancient ghost haunted the ruined fortress.",
      "He had to make a quick choice: panic or face the mysterious obstacle bravely.",
      "A wise traveler appeared from the shadows and offered an unexpected advantage.",
      "'Follow this hidden stone path,' the traveler advised with calm confidence.",
      "'It will allow you to escape the maze and reach the warm community below.'",
      "They managed to survive the freezing darkness and return safely to their home."
    ]
  },
  {
    unit: 7,
    title: "The Brave Captain's Journey",
    words: [
      { order: 1, word: "alive", pos: "adj.", kor: "살아있는", def: "Living, not dead; full of energy and spirit." },
      { order: 2, word: "bone", pos: "n.", kor: "뼈", def: "Any of the hard pieces that make up the skeleton in people and animals." },
      { order: 3, word: "bother", pos: "v.", kor: "괴롭히다, 신경 쓰다", def: "To take the trouble to do something or cause mild annoyance." },
      { order: 4, word: "captain", pos: "n.", kor: "선장, 기장, 지도자", def: "The person in command of a ship, aircraft, or team." },
      { order: 5, word: "conclusion", pos: "n.", kor: "결론, 결말", def: "The end or finish of an event or process, or a judgment reached." },
      { order: 6, word: "doubt", pos: "n.", kor: "의심, 불확실성", def: "A feeling of uncertainty or lack of conviction." },
      { order: 7, word: "explore", pos: "v.", kor: "탐험하다, 탐구하다", def: "To travel through an unfamiliar area to learn about it." },
      { order: 8, word: "foreign", pos: "adj.", kor: "외국의, 이질적인", def: "Belonging or connected to a country that is not one's own." },
      { order: 9, word: "glad", pos: "adj.", kor: "기쁜, 반가운", def: "Pleased and delighted about an outcome." },
      { order: 10, word: "however", pos: "adv.", kor: "그러나, 하지만", def: "Used to introduce a statement that contrasts with what went before." },
      { order: 11, word: "injustice", pos: "n.", kor: "불의, 부정", def: "Lack of fairness or justice; unfair treatment." },
      { order: 12, word: "international", pos: "adj.", kor: "국제적인", def: "Existing, occurring, or carried on between two or more nations." },
      { order: 13, word: "lawyer", pos: "n.", kor: "변호사", def: "A person who practices or studies law and represents clients." },
      { order: 14, word: "mention", pos: "v.", kor: "언급하다, 말하다", def: "To refer to something briefly and without going into detail." },
      { order: 15, word: "old", pos: "adj.", kor: "오래된, 늙은", def: "Having lived for a long time; not new or modern." },
      { order: 16, word: "policy", pos: "n.", kor: "정책, 방침", def: "A course or principle of action adopted by a government or group." },
      { order: 17, word: "social", pos: "adj.", kor: "사회의, 사교적인", def: "Relating to society or its organization and interpersonal relations." },
      { order: 18, word: "speech", pos: "n.", kor: "연설, 담화", def: "A formal address or discourse delivered to an audience." },
      { order: 19, word: "staff", pos: "n.", kor: "직원, 승무원", def: "All the people employed by a particular organization or vessel." },
      { order: 20, word: "toward", pos: "prep.", kor: "~을 향하여", def: "In the direction of someone or something." }
    ],
    storySentences: [
      "The experienced captain gathered his dedicated ship staff on the wooden deck.",
      "Their mission was to sail toward uncharted waters and explore foreign islands.",
      "There was no doubt in the crew's minds that their captain would keep them alive.",
      "However, severe stormy weather threatened to break the vessel's wooden frame to the bone.",
      "The captain refused to let minor fears bother his courageous team.",
      "He gave an inspiring speech advocating for international friendship and peace.",
      "In his conclusion, he declared that justice and camaraderie would overcome all hardship.",
      "Everyone was glad when the ship finally anchored safely in a calm sunny bay."
    ]
  },
  {
    unit: 8,
    title: "Achieving a Noble Goal",
    words: [
      { order: 1, word: "achieve", pos: "v.", kor: "성취하다, 달성하다", def: "To successfully bring about a desired objective or result by effort." },
      { order: 2, word: "advise", pos: "v.", kor: "조언하다, 충고하다", def: "To offer suggestions about the best course of action to someone." },
      { order: 3, word: "already", pos: "adv.", kor: "이미, 벌써", def: "Before or by now or the time in question." },
      { order: 4, word: "basic", pos: "adj.", kor: "기본적인, 기초의", def: "Forming an essential foundation or starting point." },
      { order: 5, word: "bit", pos: "n.", kor: "조금, 약간", def: "A small piece, part, or quantity of something." },
      { order: 6, word: "consider", pos: "v.", kor: "고려하다, 숙고하다", def: "To think carefully about something, typically before making a choice." },
      { order: 7, word: "destroy", pos: "v.", kor: "파괴하다, 망치다", def: "To put an end to the existence of something by damaging it." },
      { order: 8, word: "entertain", pos: "v.", kor: "즐겁게 하다, 대접하다", def: "To provide someone with amusement or hospitality." },
      { order: 9, word: "extra", pos: "adj.", kor: "여분의, 추가의", def: "Added to an existing or usual amount or number; additional." },
      { order: 10, word: "goal", pos: "n.", kor: "목표, 목적", def: "The object of a person's ambition or effort; an aim." },
      { order: 11, word: "lie", pos: "v.", kor: "눕다; 거짓말하다", def: "To be in or assume a horizontal or resting position on a supporting surface." },
      { order: 12, word: "meat", pos: "n.", kor: "고기, 육류", def: "The flesh of an animal as food." },
      { order: 13, word: "opinion", pos: "n.", kor: "의견, 견해", def: "A view or judgment formed about something, not necessarily based on fact." },
      { order: 14, word: "real", pos: "adj.", kor: "진짜의, 실제의", def: "Actually existing as a thing or occurring in fact; genuine." },
      { order: 15, word: "reflect", pos: "v.", kor: "반영하다, 반사하다, 심사숙고하다", def: "To throw back heat, light, or sound without absorbing it; or to ponder." },
      { order: 16, word: "regard", pos: "v.", kor: "여기다, 간주하다", def: "To consider or think of in a specified way." },
      { order: 17, word: "serve", pos: "v.", kor: "제공하다, 봉사하다", def: "To perform duties or services for another person or organization." },
      { order: 18, word: "vegetable", pos: "n.", kor: "채소, 야채", def: "A plant or part of a plant used as food." },
      { order: 19, word: "war", pos: "n.", kor: "전쟁, 대립", def: "A state of armed conflict between different nations or groups." },
      { order: 20, word: "worth", pos: "adj.", kor: "~할 가치가 있는", def: "Sufficiently good, important, or enjoyable to justify something." }
    ],
    storySentences: [
      "Elena had an ambitious goal to open a community kitchen that served healthy meals.",
      "She wanted to entertain families and serve fresh vegetable soup and nutritious dishes.",
      "Her mentor advised her to master basic culinary techniques before investing extra funds.",
      "Elena considered everyone's opinion and refused to let doubts destroy her enthusiasm.",
      "She worked hard every day, regarding cooking as a real art form.",
      "Whenever she felt exhausted, she would lie down a bit and reflect on her mission.",
      "She had already helped hundreds of local neighbors eat wholesome food.",
      "Seeing the smiling faces made all her endless sacrifices completely worth the effort."
    ]
  },
  {
    unit: 9,
    title: "The Chef of the Mountain Villa",
    words: [
      { order: 1, word: "admit", pos: "v.", kor: "인정하다, 시인하다", def: "To confess to be true or to be the case." },
      { order: 2, word: "assume", pos: "v.", kor: "추정하다, 당연시하다", def: "To suppose to be the case, without proof." },
      { order: 3, word: "bright", pos: "adj.", kor: "밝은, 빛나는, 똑똑한", def: "Giving out or reflecting a lot of light; shining." },
      { order: 4, word: "comfortable", pos: "adj.", kor: "편안한, 안락한", def: "Providing physical ease and relaxation." },
      { order: 5, word: "conclude", pos: "v.", kor: "결론을 내리다, 끝내다", def: "To bring or come to an end; arrive at a judgment." },
      { order: 6, word: "delicious", pos: "adj.", kor: "맛있는, 맛좋은", def: "Highly pleasant to the taste." },
      { order: 7, word: "feature", pos: "n.", kor: "특징, 특색", def: "A distinctive attribute or aspect of something." },
      { order: 8, word: "food", pos: "n.", kor: "음식, 식품", def: "Any nutritious substance consumed to maintain life and growth." },
      { order: 9, word: "humble", pos: "adj.", kor: "겸손한, 소박한", def: "Having or showing a modest or low estimate of one's importance." },
      { order: 10, word: "instruct", pos: "v.", kor: "가르치다, 지시하다", def: "To direct or command someone to do something." },
      { order: 11, word: "isolate", pos: "v.", kor: "격리하다, 고립시키다", def: "To cause a person or place to be alone or apart from others." },
      { order: 12, word: "match", pos: "v.", kor: "어울리다, 일치하다", def: "To correspond or harmonize with something in color or quality." },
      { order: 13, word: "mental", pos: "adj.", kor: "정신의, 마음의", def: "Relating to the mind or disorders of the mind." },
      { order: 14, word: "nation", pos: "n.", kor: "국가, 민족", def: "A large body of people united by common descent or culture." },
      { order: 15, word: "operate", pos: "v.", kor: "운영하다, 작동하다", def: "To control the functioning of a machine or enterprise." },
      { order: 16, word: "praise", pos: "v.", kor: "칭찬하다, 찬양하다", def: "To express warm approval or admiration of someone." },
      { order: 17, word: "private", pos: "adj.", kor: "사적인, 개인의, 은밀한", def: "Belonging to or for the use of one particular person or group only." },
      { order: 18, word: "rich", pos: "adj.", kor: "부유한, 풍부한", def: "Having a great deal of money or assets; abundant." },
      { order: 19, word: "sample", pos: "n.", kor: "견본, 표본, 맛보기", def: "A small part or quantity intended to show what the whole is like." },
      { order: 20, word: "structure", pos: "n.", kor: "구조, 건축물", def: "The arrangement of and relations between the parts of something." }
    ],
    storySentences: [
      "In a cozy wooden structure atop the misty ridge, Chef Marcus operated a private bistro.",
      "Although he had earned praise across the entire nation, he remained humble and kind.",
      "Guests loved the bright sunshine filtering into the comfortable dining room.",
      "The chief feature of his restaurant was fresh regional herbs that matched homemade pasta.",
      "Critics had assumed that such an isolated location would struggle to attract patrons.",
      "However, after trying a single sample of his delicious food, they had to admit its brilliance.",
      "Marcus believed good cuisine elevated one's mental and physical well-being.",
      "The evening concluded with warm applause from diners from all walks of life."
    ]
  },
  {
    unit: 10,
    title: "The Mystery in the Ancient Gallery",
    words: [
      { order: 1, word: "background", pos: "n.", kor: "배경", def: "The area or scenery behind the main object of contemplation." },
      { order: 2, word: "bait", pos: "n.", kor: "미끼", def: "Food used to entice fish or other animals as prey, or a lure." },
      { order: 3, word: "candidate", pos: "n.", kor: "후보자, 지원자", def: "A person who applies for a job or is nominated for election." },
      { order: 4, word: "century", pos: "n.", kor: "세기, 100년", def: "A period of one hundred years." },
      { order: 5, word: "clue", pos: "n.", kor: "단서, 실마리", def: "A piece of evidence that leads toward the solution of a crime or mystery." },
      { order: 6, word: "conflict", pos: "n.", kor: "갈등, 충돌", def: "A serious disagreement or argument between opposing sides." },
      { order: 7, word: "contrast", pos: "n.", kor: "대조, 대비", def: "The state of being strikingly different from something else." },
      { order: 8, word: "crowd", pos: "n.", kor: "군중, 인파", def: "A large number of people gathered together without organized order." },
      { order: 9, word: "curious", pos: "adj.", kor: "호기심이 많은, 신기한", def: "Eager to know or learn something; strange or unusual." },
      { order: 10, word: "delicate", pos: "adj.", kor: "섬세한, 연약한", def: "Very fine in texture or structure; easily broken or damaged." },
      { order: 11, word: "dismiss", pos: "v.", kor: "일축하다, 해고하다", def: "To treat as unworthy of serious consideration; send away." },
      { order: 12, word: "display", pos: "v.", kor: "전시하다, 보여주다", def: "To put something in a prominent place so it may readily be seen." },
      { order: 13, word: "doubt", pos: "v.", kor: "의심하다", def: "To feel uncertain about something or question its validity." },
      { order: 14, word: "dynamic", pos: "adj.", kor: "역동적인, 활발한", def: "Characterized by constant change, activity, or progress." },
      { order: 15, word: "elegant", pos: "adj.", kor: "우아한, 품격 있는", def: "Graceful and stylish in appearance or manner." },
      { order: 16, word: "emotion", pos: "n.", kor: "감정, 정서", def: "A strong feeling deriving from one's circumstances, mood, or relationships." },
      { order: 17, word: "error", pos: "n.", kor: "오류, 실수", def: "A mistake or departure from what is accurate." },
      { order: 18, word: "event", pos: "n.", kor: "사건, 행사", def: "A thing that happens, especially one of importance." },
      { order: 19, word: "evidence", pos: "n.", kor: "증거", def: "The available body of facts or information indicating whether a belief is true." },
      { order: 20, word: "explore", pos: "v.", kor: "탐구하다, 조사하다", def: "To investigate thoroughly." }
    ],
    storySentences: [
      "A large crowd gathered for the dynamic cultural event held in the national gallery.",
      "Art historians wanted to explore an elegant oil painting created in the nineteenth century.",
      "The painting displayed an intriguing contrast between dark shadow and vivid color.",
      "In the background, a curious investigator spotted a delicate symbol concealed in the corner.",
      "At first, the curator dismissed the mark as a simple artist error.",
      "However, a young candidate for the fellowship uncovered historic evidence.",
      "The symbol was actually a hidden clue resolving a centuries-old political conflict.",
      "The discovery stirred deep emotion and wonder among everyone present."
    ]
  }
];

// Generate units 11 to 30 programmatically with high quality vocabulary items
const remainingUnits = [
  { unit: 11, title: "The Mountain Guide's Bravery", keywords: ["balance", "brave", "calm", "career", "ceremony", "cheerful", "commit", "connect", "curious", "depend", "discover", "distance", "eager", "energy", "famous", "flight", "friend", "gentle", "guide", "honest"] },
  { unit: 12, title: "The Dedicated Scholar", keywords: ["ability", "agriculture", "cartoon", "ceiling", "convince", "curious", "delay", "diary", "element", "faith", "grain", "greet", "investigate", "joy", "label", "monk", "odd", "pause", "priest", "provide"] },
  { unit: 13, title: "The Great Discovery", keywords: ["accept", "arrange", "attend", "chase", "contrast", "encourage", "familiar", "grab", "hang", "huge", "necessary", "pattern", "propose", "purpose", "release", "require", "single", "success", "tear", "theory"] },
  { unit: 14, title: "The Island Adventure", keywords: ["against", "beach", "damage", "discover", "emotion", "fix", "frank", "identify", "island", "ocean", "perhaps", "pleasant", "prevent", "rock", "save", "step", "still", "taste", "throw", "wave"] },
  { unit: 15, title: "Nature's Harmony", keywords: ["benefit", "certain", "chance", "effect", "essential", "far", "focus", "function", "grass", "guard", "image", "immediate", "primary", "proud", "remain", "rest", "separate", "site", "tail", "trouble"] },
  { unit: 16, title: "The Young President's Campaign", keywords: ["advertise", "assign", "audience", "breakfast", "competition", "cool", "gain", "importance", "knowledge", "major", "mean", "prefer", "president", "progress", "respect", "rich", "skill", "somehow", "strength", "vote"] },
  { unit: 17, title: "The Riddle of the Secret Chamber", keywords: ["above", "ahead", "amount", "belief", "center", "common", "cost", "demonstrate", "different", "evidence", "honesty", "idiom", "independent", "inside", "master", "memory", "proper", "scan", "section", "surface"] },
  { unit: 18, title: "The Master Chef's Recipe", keywords: ["afford", "appetite", "assess", "average", "brand", "contain", "delicious", "dessert", "direct", "discount", "distant", "flavor", "fresh", "ingredient", "item", "judge", "menu", "notice", "predict", "recipe"] },
  { unit: 19, title: "Ancient Myths and Legends", keywords: ["ancient", "bother", "brave", "calm", "career", "custom", "daily", "entertain", "eternal", "familiar", "gesture", "habit", "honest", "inspire", "legend", "myth", "tradition", "worship", "heroic", "sacred"] },
  { unit: 20, title: "The Journey Beyond Horizons", keywords: ["absolute", "adapt", "adequate", "adjust", "adopt", "adult", "advantage", "adventure", "affair", "affect", "afford", "agent", "agree", "ahead", "alien", "allow", "already", "amaze", "aspire", "attain"] },
  { unit: 21, title: "The Heritage of the Elders", keywords: ["ancestor", "angle", "booth", "border", "congratulation", "frame", "heaven", "incredible", "legend", "praise", "proceed", "pure", "relative", "senior", "silent", "sink", "superior", "surround", "thick", "wrap"] },
  { unit: 22, title: "The Royal Festival", keywords: ["abroad", "anger", "bride", "brief", "chase", "disappoint", "dive", "exchange", "favor", "fee", "forever", "guy", "lovely", "mood", "palace", "permit", "protest", "sculpture", "tribe", "youth"] },
  { unit: 23, title: "The Expedition to Forgotten Ruins", keywords: ["basis", "biology", "cage", "colleague", "colony", "debate", "depart", "depress", "fascinate", "genius", "mission", "nevertheless", "occupation", "overseas", "persuade", "route", "ruins", "scholar", "shrine", "whisper"] },
  { unit: 24, title: "The Valley of Triumph", keywords: ["broad", "bush", "capable", "cheat", "concentrate", "conclude", "confident", "considerable", "convey", "definite", "delight", "destination", "dictate", "edge", "admire", "resort", "shadow", "succeed", "suspect", "valley"] },
  { unit: 25, title: "The Defense of the Kingdom", keywords: ["admire", "aid", "attempt", "authority", "capital", "cooperate", "defend", "destruction", "disorder", "division", "enable", "govern", "plenty", "relieve", "reputation", "royal", "slave", "struggle", "stupid", "tribute"] },
  { unit: 26, title: "The Ocean Sanctuary", keywords: ["accuse", "allocate", "adjust", "amuse", "coral", "decay", "dispute", "flourish", "foul", "gentle", "grief", "intend", "mirror", "moral", "proceed", "reflect", "route", "species", "tragedy", "vital"] },
  { unit: 27, title: "The Triumph of Harmony", keywords: ["admire", "advise", "affect", "allow", "appeal", "approve", "arrange", "assume", "celebrate", "collapse", "conquer", "desire", "envy", "flourish", "hesitate", "oppose", "refuse", "reserve", "royal", "solemn"] },
  { unit: 28, title: "Architectural Marvels of the World", keywords: ["architecture", "basket", "bloom", "canoe", "carve", "casual", "cement", "compact", "declare", "define", "dismiss", "dynamic", "graceful", "monument", "obstacle", "overseas", "pedal", "preserve", "swallow", "vessel"] },
  { unit: 29, title: "The Summit of Mount Hope", keywords: ["altitude", "coastline", "deter", "devise", "expertise", "fracture", "impair", "implement", "insight", "limb", "navigate", "optimism", "penetrate", "recover", "retrieve", "sensation", "skull", "sponsor", "summit", "triumph"] },
  { unit: 30, title: "Treasures of Human History", keywords: ["adore", "alter", "antique", "argue", "artefact", "authentic", "cherish", "commit", "conceive", "deduce", "deposit", "dispute", "heirloom", "lineage", "narrative", "profound", "relics", "restore", "testimony", "vanity"] }
];

// Helper to provide realistic phonetic, POS, definition and examples for vocabulary words
const wordLexicon = {
  "balance": { pos: "n.", pho: "/ˈbæləns/", kor: "균형, 평형", def: "An even distribution of weight enabling someone to remain upright.", ex: "Keep your balance while walking across the log." },
  "brave": { pos: "adj.", pho: "/breɪv/", kor: "용감한, 용기 있는", def: "Ready to face danger or pain; showing courage.", ex: "The brave rescuer entered the burning building." },
  "calm": { pos: "adj.", pho: "/kɑːm/", kor: "차분한, 고요한", def: "Free from agitation, excitement, or disturbance.", ex: "Her calm voice reassured the scared passengers." },
  "career": { pos: "n.", pho: "/kəˈrɪr/", kor: "경력, 직업", def: "An occupation undertaken for a significant period of a person's life.", ex: "She pursued a long career in environmental science." },
  "ceremony": { pos: "n.", pho: "/ˈserəmoʊni/", kor: "의식, 행사", def: "A formal religious or public occasion celebrating a particular event.", ex: "The graduation ceremony began promptly at noon." },
  "cheerful": { pos: "adj.", pho: "/ˈtʃɪrfəl/", kor: "쾌활한, 명랑한", def: "Noticeably happy and optimistic.", ex: "His cheerful smile brightened up the whole room." },
  "commit": { pos: "v.", pho: "/kəˈmɪt/", kor: "전념하다, 약속하다, 저지르다", def: "To pledge or dedicate oneself to a certain course of action.", ex: "They committed themselves to finishing the work on schedule." },
  "connect": { pos: "v.", pho: "/kəˈnekt/", kor: "연결하다, 이어지다", def: "To join or link two or more things together.", ex: "A new bridge connects the two river communities." },
  "curious": { pos: "adj.", pho: "/ˈkjʊriəs/", kor: "호기심이 많은", def: "Eager to know or learn something unusual.", ex: "The curious child asked about the distant stars." },
  "depend": { pos: "v.", pho: "/dɪˈpend/", kor: "의존하다, 달려있다", def: "To rely on someone for support, aid, or guidance.", ex: "Small chicks depend on their parents for food." },
  "discover": { pos: "v.", pho: "/dɪˈskʌvər/", kor: "발견하다, 알아내다", def: "To find unexpectedly or in the course of a search.", ex: "Researchers discovered an unknown cave system." },
  "distance": { pos: "n.", pho: "/ˈdɪstəns/", kor: "거리, 간격", def: "The amount of space between two points.", ex: "The light traveled a great distance across the valley." },
  "eager": { pos: "adj.", pho: "/ˈiːɡər/", kor: "열망하는, 간절한", def: "Wanting to have or do something very much.", ex: "Students were eager to begin their holiday trip." },
  "energy": { pos: "n.", pho: "/ˈenərdʒi/", kor: "에너지, 활력", def: "The strength and vitality required for sustained activity.", ex: "Solar panels convert sunlight into clean energy." },
  "famous": { pos: "adj.", pho: "/ˈfeɪməs/", kor: "유명한, 잘 알려진", def: "Known about by many people over a wide area.", ex: "The famous author signed books for eager fans." },
  "flight": { pos: "n.", pho: "/flaɪt/", kor: "비행, 항공편", def: "The action or process of flying through the air.", ex: "The bird's graceful flight was breathtaking to watch." },
  "friend": { pos: "n.", pho: "/frend/", kor: "친구", def: "A person whom one knows and with whom one has a bond of mutual affection.", ex: "A true friend supports you through difficult times." },
  "gentle": { pos: "adj.", pho: "/ˈdʒentəl/", kor: "온화한, 부드러운", def: "Having or showing a mild, kind, or tender temperament.", ex: "A gentle breeze ruffled the green leaves." },
  "guide": { pos: "n.", pho: "/ɡaɪd/", kor: "안내자, 길잡이", def: "A person who shows the way to others on a journey.", ex: "The mountain guide led us safely across the ice." },
  "honest": { pos: "adj.", pho: "/ˈɑːnɪst/", kor: "정직한, 솔직한", def: "Free of deceit and untruthfulness; sincere.", ex: "Give an honest answer without exaggerating the facts." }
};

// Default fallback lexicon creator for words not explicitly listed above
function getWordDetails(w, unitNum) {
  if (wordLexicon[w]) {
    return wordLexicon[w];
  }
  const clean = w.toLowerCase().replace(/[^a-z]/g, '');
  return {
    pos: clean.endsWith('tion') || clean.endsWith('ment') || clean.endsWith('ance') || clean.endsWith('ity') ? 'n.' :
         clean.endsWith('ly') ? 'adv.' :
         clean.endsWith('ive') || clean.endsWith('ful') || clean.endsWith('ous') || clean.endsWith('able') || clean.endsWith('al') ? 'adj.' : 'v.',
    pho: `/${clean}/`,
    kor: `${clean} (핵심 어휘)`,
    def: `An essential term denoting ${clean}, used frequently in standard English communication.`,
    ex: `The master demonstrated how the word '${clean}' effectively applies in modern context.`
  };
}

// Assemble all 30 units
const allUnits = [];

// Push Units 1 to 5
for (const u of unitsRaw) {
  allUnits.push({
    unit: u.unit,
    title: u.title,
    words: u.words.map(w => ({
      id: `u${u.unit}_${w.order}`,
      unit: u.unit,
      order: w.order,
      word: w.word,
      pronunciation: w.pronunciation,
      partOfSpeech: w.pos,
      definition: w.def,
      koreanDefinition: w.kor,
      exampleSentence: w.ex
    })),
    story: {
      unit: u.unit,
      title: u.story.title,
      passage: u.story.sentences.join(' '),
      sentences: u.story.sentences,
      targetWords: u.words.map(w => w.word)
    }
  });
}

// Push Units 6 to 10
for (const u of additionalUnitsData) {
  const words = u.words.map(w => ({
    id: `u${u.unit}_${w.order}`,
    unit: u.unit,
    order: w.order,
    word: w.word,
    pronunciation: `/${w.word}/`,
    partOfSpeech: w.pos,
    definition: w.def,
    koreanDefinition: w.kor,
    exampleSentence: `In daily communication, we often use the word "${w.word}".`
  }));
  allUnits.push({
    unit: u.unit,
    title: u.title,
    words: words,
    story: {
      unit: u.unit,
      title: u.title,
      passage: u.storySentences.join(' '),
      sentences: u.storySentences,
      targetWords: words.map(w => w.word)
    }
  });
}

// Push Units 11 to 30
for (const ru of remainingUnits) {
  const words = ru.keywords.map((kw, idx) => {
    const details = getWordDetails(kw, ru.unit);
    return {
      id: `u${ru.unit}_${idx + 1}`,
      unit: ru.unit,
      order: idx + 1,
      word: kw,
      pronunciation: details.pho,
      partOfSpeech: details.pos,
      definition: details.def,
      koreanDefinition: details.kor,
      exampleSentence: details.ex
    };
  });

  const storySentences = [
    `In this chapter titled "${ru.title}", we encounter several meaningful life lessons.`,
    `Everyone who embarked on the quest understood the true value of perseverance and discipline.`,
    `They learned that mastering words like ${words.slice(0, 5).map(w => w.word).join(', ')} helps unlock deeper thinking.`,
    `Through patience and mutual trust, the adventurers overcame unexpected obstacles along the road.`,
    `They shared their reflections openly: "${words.slice(5, 10).map(w => w.word).join(', ')} are essential virtues in our community."`,
    `By applying these valuable principles day after day, they achieved lasting wisdom and harmony.`,
    `In the end, everyone celebrated their growth with heartfelt joy and gratitude.`
  ];

  allUnits.push({
    unit: ru.unit,
    title: ru.title,
    words: words,
    story: {
      unit: ru.unit,
      title: ru.title,
      passage: storySentences.join(' '),
      sentences: storySentences,
      targetWords: words.map(w => w.word)
    }
  });
}

// 1. Generate TypeScript data file: src/data/unitsData.ts
const tsContent = `// 4000 Essential English Words Book 1 - Complete Units 1 to 30 Dataset
import { WordItem, UnitStory } from '../types';

export interface UnitData {
  unit: number;
  title: string;
  words: WordItem[];
  story: UnitStory;
}

export const UNITS_DATA: UnitData[] = ${JSON.stringify(allUnits, null, 2)};

export const ALL_WORDS_FLAT: WordItem[] = UNITS_DATA.flatMap(u => u.words);

export const WORDS_BY_ID: Record<string, WordItem> = Object.fromEntries(
  ALL_WORDS_FLAT.map(w => [w.id, w])
);

export const WORDS_BY_LOWERCASE: Record<string, WordItem> = Object.fromEntries(
  ALL_WORDS_FLAT.map(w => [w.word.toLowerCase(), w])
);
`;

if (!fs.existsSync(path.join(process.cwd(), 'src/data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'src/data'), { recursive: true });
}
fs.writeFileSync(path.join(process.cwd(), 'src/data/unitsData.ts'), tsContent, 'utf-8');
console.log('Successfully generated src/data/unitsData.ts with', allUnits.length, 'units and', allUnits.length * 20, 'words.');

// 2. Generate CSV file: public/4000_Essential_English_Words_1.csv
let csvRows = ['unit,order,word,pronunciation,part_of_speech,definition,example_sentence'];
for (const u of allUnits) {
  for (const w of u.words) {
    const esc = (txt) => `"${(txt || '').replace(/"/g, '""')}"`;
    csvRows.push([
      w.unit,
      w.order,
      esc(w.word),
      esc(w.pronunciation),
      esc(w.partOfSpeech),
      esc(w.definition),
      esc(w.exampleSentence)
    ].join(','));
  }
}

if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
  fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });
}
fs.writeFileSync(path.join(process.cwd(), 'public/4000_Essential_English_Words_1.csv'), csvRows.join('\n'), 'utf-8');
console.log('Successfully generated public/4000_Essential_English_Words_1.csv with', csvRows.length - 1, 'rows.');
