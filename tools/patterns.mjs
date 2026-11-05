// Original bead pattern designs used to generate patterns/*.html.
// Each row is one line of beads; "." means no bead. Every other character is a
// color key from COLOR_KEYS, which pins it to a MARD color code.

export const COLOR_KEYS = {
  K: 'H7',  // black outline
  W: 'H2',  // white
  C: 'G18', // cream
  R: 'F5',  // red
  P: 'E3',  // pink
  O: 'A7',  // orange
  Q: 'G20', // dark orange
  Y: 'A5',  // yellow
  G: 'B8',  // green
  D: 'B15', // dark green
  B: 'G7',  // brown
  b: 'G9',  // light brown
  T: 'G12', // milk tea
  X: 'G8',  // dark brown (tapioca pearls)
  S: 'H3',  // grey
  s: 'H11', // light grey
  V: 'E4'   // rose pink
};

export const CATEGORIES = [
  { id: 'animals', name: '可愛動物' },
  { id: 'food', name: '美食點心' },
  { id: 'holiday', name: '節慶主題' },
  { id: 'basic', name: '入門小物' }
];

export const PATTERNS = [
  {
    slug: 'heart', name: '愛心', category: 'basic',
    intro: '最經典的入門圖案，只用三種顏色，適合第一次拼豆、做鑰匙圈或情人節小禮物。',
    rows: [
      '..KKKK....KKKK..',
      '.KRRRRK..KRRRRK.',
      'KRRWWRRKKRRRRRRK',
      'KRWWRRRRRRRRRRRK',
      'KRWRRRRRRRRRRRRK',
      'KRRRRRRRRRRRRRRK',
      'KRRRRRRRRRRRRRRK',
      '.KRRRRRRRRRRRRK.',
      '..KRRRRRRRRRRK..',
      '...KRRRRRRRRK...',
      '....KRRRRRRK....',
      '.....KRRRRK.....',
      '......KRRK......',
      '.......KK.......'
    ]
  },
  {
    slug: 'cat', name: '灰貓咪', category: 'animals',
    intro: '圓圓的灰色貓咪臉，粉紅耳朵和腮紅很可愛，做成杯墊或冰箱磁鐵都適合。',
    rows: [
      '.KK..........KK.',
      '.KSK........KSK.',
      '.KSPK......KPSK.',
      '.KSSSKKKKKKSSSK.',
      'KSSSSSSSSSSSSSSK',
      'KSSSSSSSSSSSSSSK',
      'KSSKKSSSSSSKKSSK',
      'KSSKKSSSSSSKKSSK',
      'KSPPSSSSSSSSPPSK',
      'KSSSSSSPPSSSSSSK',
      'KSSSSSKSSKSSSSSK',
      '.KSSSSSKKSSSSSK.',
      '..KSSSSSSSSSSK..',
      '...KKKKKKKKKK...'
    ]
  },
  {
    slug: 'shiba', name: '柴犬', category: 'animals',
    intro: '橘色柴犬加上白色臉頰，是很受歡迎的拼豆題材，適合送給愛狗的朋友。',
    rows: [
      '.KK..........KK.',
      '.KOK........KOK.',
      '.KOCK......KCOK.',
      '.KOOOKKKKKKOOOK.',
      'KOOOOOOOOOOOOOOK',
      'KOOCOOOOOOOOCOOK',
      'KOOKKOOOOOOKKOOK',
      'KOOKKOOOOOOKKOOK',
      'KOWWWWOOOOWWWWOK',
      'KWWWWWWKKWWWWWWK',
      '.KWWWWWWWWWWWWK.',
      '..KWWWWWWWWWWK..',
      '...KKKKKKKKKK...'
    ]
  },
  {
    slug: 'rabbit', name: '小白兔', category: 'animals',
    intro: '長耳朵的小白兔，白色珠子搭配粉紅色耳朵和腮紅，簡單又討喜。',
    rows: [
      '...KK......KK...',
      '..KWWK....KWWK..',
      '..KWPK....KPWK..',
      '..KWPK....KPWK..',
      '..KWPK....KPWK..',
      '..KWWKKKKKKWWK..',
      '.KWWWWWWWWWWWWK.',
      'KWWWWWWWWWWWWWWK',
      'KWWWKWWWWWWKWWWK',
      'KWWWKWWWWWWKWWWK',
      'KWPPWWWWWWWWPPWK',
      'KWWWWWWPPWWWWWWK',
      '.KWWWWWWWWWWWWK.',
      '..KWWWWWWWWWWK..',
      '...KKKKKKKKKK...'
    ]
  },
  {
    slug: 'bear', name: '小熊', category: 'animals',
    intro: '咖啡色小熊臉，淺咖啡色的嘴巴和粉紅腮紅，是新手也能輕鬆完成的動物圖案。',
    rows: [
      '.KKK........KKK.',
      'KBBBK......KBBBK',
      'KBbBKKKKKKKKBbBK',
      '.KBBBBBBBBBBBBK.',
      'KBBBBBBBBBBBBBBK',
      'KBBBBBBBBBBBBBBK',
      'KBBBKBBBBBBKBBBK',
      'KBBBKBBBBBBKBBBK',
      'KBBBBBbbbbBBBBBK',
      'KBBBBbbKKbbBBBBK',
      'KBPBBbbbbbbBBPBK',
      '.KBBBBbbbbBBBBK.',
      '..KBBBBBBBBBBK..',
      '...KKKKKKKKKK...'
    ]
  },
  {
    slug: 'penguin', name: '企鵝', category: 'animals',
    intro: '黑白配色的胖企鵝，橘色嘴巴和腳掌是重點，顏色少、很適合小朋友練習。',
    rows: [
      '.....KKKKKK.....',
      '....KKKKKKKK....',
      '...KKKKKKKKKK...',
      '...KKWWKKWWKK...',
      '...KWKWWWWKWK...',
      '...KWWWOOWWWK...',
      '..KKWWOOOOWWKK..',
      '.KKKWWWWWWWWKKK.',
      '.KKWWWWWWWWWWKK.',
      '.KKWWWWWWWWWWKK.',
      '..KWWWWWWWWWWK..',
      '..KKWWWWWWWWKK..',
      '...KKKKKKKKKK...',
      '...OOO....OOO...'
    ]
  },
  {
    slug: 'chick', name: '小雞', category: 'animals',
    intro: '圓滾滾的黃色小雞，配上橘色嘴巴和小腳，做成髮夾或吊飾都很可愛。',
    rows: [
      '......KKKK......',
      '....KKYYYYKK....',
      '...KYYYYYYYYK...',
      '..KYYYYYYYYYYK..',
      '..KYYKYYYYKYYK..',
      '.KYYYKYYYYKYYYK.',
      '.KYPYYYOOYYYPYK.',
      '.KYYYYOOOOYYYYK.',
      '.KYYYYYOOYYYYYK.',
      '.KYYYYYYYYYYYYK.',
      '..KYYYYYYYYYYK..',
      '...KKYYYYYYKK...',
      '.....KKKKKK.....',
      '.....O....O.....',
      '....OO....OO....'
    ]
  },
  {
    slug: 'strawberry', name: '草莓', category: 'food',
    intro: '紅色草莓加上黃色籽和綠色葉子，配色鮮豔，是很受歡迎的水果圖案。',
    rows: [
      '.......DD.......',
      '....DDGGGGDD....',
      '...DGGGDDGGGD...',
      '..KKRRGGGGRRKK..',
      '.KRRRRRRRRRRRRK.',
      '.KRYRRRYRRRYRRK.',
      '.KRRRRRRRRRRRRK.',
      '.KRRRYRRRYRRRRK.',
      '..KRRRRRRRRRYK..',
      '..KRYRRRYRRRRK..',
      '...KRRRRRRRRK...',
      '...KRRRYRRRRK...',
      '....KRRRRRRK....',
      '.....KRRRRK.....',
      '......KKKK......'
    ]
  },
  {
    slug: 'watermelon', name: '西瓜', category: 'food',
    intro: '夏天必做的西瓜片，紅色果肉、黑色籽加上綠色果皮，一眼就認得出來。',
    rows: [
      'KKKKKKKKKKKKKKKK',
      'KRRRRRRRRRRRRRRK',
      'KRRRKRRRRRRKRRRK',
      'KCRRRRRRKRRRRRCK',
      'KGCRRKRRRRRKRCGK',
      '.KGCRRRRRRRRCGK.',
      '.KGGCCRRRRCCGGK.',
      '..KGGGCCCCGGGK..',
      '...KKGGGGGGKK...',
      '.....KKKKKK.....'
    ]
  },
  {
    slug: 'bubble-tea', name: '珍珠奶茶', category: 'food',
    intro: '台灣人最愛的珍珠奶茶！奶茶色杯身加上深咖啡色珍珠，做成杯墊或磁鐵超有台灣味。',
    rows: [
      '........KK....',
      '.......KVK....',
      '......KVK.....',
      '..KKKKKVKKKK..',
      '.KssssKVKsssK.',
      'KKKKKKKVKKKKKK',
      '.KTTTTTVTTTTK.',
      '.KTTTTTVTTTTK.',
      '.KTTTTTVTTTTK.',
      '..KTTTTVTTTK..',
      '..KTTTTVTTTK..',
      '..KTXTTVTXTK..',
      '..KXTXTXTXXK..',
      '...KXXTXXTK...',
      '...KXTXXTXK...',
      '....KKKKKK....'
    ]
  },
  {
    slug: 'ice-cream', name: '冰淇淋', category: 'food',
    intro: '粉紅色草莓冰淇淋配上格紋餅乾杯，顏色少、形狀簡單，適合拼豆新手。',
    rows: [
      '....KKKK....',
      '..KKPPPPKK..',
      '.KPPWWPPPPK.',
      '.KPWPPPPPPK.',
      'KPPPPPPPPPPK',
      'KPPPPPPPPPPK',
      'KKKKKKKKKKKK',
      '.KbbbbbbbbK.',
      '.KbBbbBbbbK.',
      '..KbbbbBbK..',
      '..KbBbbbbK..',
      '...KbbBbK...',
      '...KbbbbK...',
      '....KbbK....',
      '....KbbK....',
      '.....KK.....'
    ]
  },
  {
    slug: 'pineapple', name: '鳳梨', category: 'food',
    intro: '黃橘交錯的鳳梨紋路加上綠色葉子，旺來好兆頭，很適合當作開運小物送人。',
    rows: [
      '....G..G....',
      '..G.GGGG.G..',
      '...GGDDGG...',
      '....GDDG....',
      '...KKKKKK...',
      '..KYOYYOYK..',
      '.KYYYOOYYYK.',
      '.KOYYOOYYOK.',
      '.KYOOYYOOYK.',
      '.KYYOYYOYYK.',
      '.KOYYOOYYOK.',
      '.KYOOYYOOYK.',
      '..KYYOOYYK..',
      '...KKKKKK...'
    ]
  },
  {
    slug: 'christmas-tree', name: '聖誕樹', category: 'holiday',
    intro: '頂端有黃色星星、掛滿彩色裝飾的聖誕樹，可以做成聖誕吊飾或卡片裝飾。',
    rows: [
      '.......Y.......',
      '......YYY......',
      '.......Y.......',
      '......GGG......',
      '.....GGRGG.....',
      '....GGGGGGG....',
      '...GGYGGGGGG...',
      '.....GGGGG.....',
      '....GGGGRGG....',
      '...GGGGGGGGG...',
      '..GGRGGGGGYGG..',
      '.GGGGGGGGGGGGG.',
      '......BBB......',
      '......BBB......',
      '....RRRRRRR....',
      '.....RRRRR.....'
    ]
  },
  {
    slug: 'pumpkin', name: '萬聖節南瓜', category: 'holiday',
    intro: '帶著笑臉的萬聖節南瓜燈，深橘色紋路讓南瓜更立體，適合萬聖節佈置。',
    rows: [
      '.......BB.......',
      '......BBG.......',
      '....KKKKKKKK....',
      '..KKOOQOOQOOKK..',
      '.KOOOQOOOOQOOOK.',
      'KOOKKQOOOOQKKOOK',
      'KOOOKQOOOOQKOOOK',
      'KOOOOQOKKOQOOOOK',
      'KOOKOKOKKOKOKOOK',
      '.KOOKKKKKKKKOOK.',
      '..KKOOQOOQOOKK..',
      '....KKKKKKKK....'
    ]
  },
  {
    slug: 'snowman', name: '雪人', category: 'holiday',
    intro: '戴著黑帽子、圍著紅圍巾的雪人，冬天和聖誕節都很適合。',
    rows: [
      '...KKKKKK...',
      '...KKKKKK...',
      '..KKKKKKKK..',
      '...KWWWWK...',
      '..KWKWWKWK..',
      '..KWWOOWWK..',
      '...KWWWWK...',
      '..RRRRRRRR..',
      '.KWWWRRWWWK.',
      'KWWWWRKWWWWK',
      'KWWWWWWWWWWK',
      'KWWWWWKWWWWK',
      'KWWWWWWWWWWK',
      '.KWWWWWWWWK.',
      '..KKKKKKKK..'
    ]
  },
  {
    slug: 'flower', name: '小花', category: 'basic',
    intro: '粉紅花瓣、黃色花心再加上綠色莖葉，沒有黑色輪廓，風格更柔和。',
    rows: [
      '.....PPP.....',
      '..PP.PPP.PP..',
      '.PPPPPPPPPPP.',
      '.PPPPYYYPPPP.',
      '..PPYYYYYPP..',
      'PPPPYYYYYPPPP',
      '.PPPYYYYYPPP.',
      '..PPPYYYPPP..',
      '.PPPPPPPPPPP.',
      '..PP.PPP.PP..',
      '......G......',
      '..GG..G......',
      '...GGGG..GG..',
      '......GGGG...',
      '......G......'
    ]
  }
];
