const charMap = [
  { code: 0x00, value: 'あ' },
  { code: 0x01, value: 'い' },
  { code: 0x02, value: 'う' },
  { code: 0x03, value: 'え' },
  { code: 0x04, value: 'お' },
  { code: 0x05, value: 'か' },
  { code: 0x06, value: 'き' },
  { code: 0x07, value: 'く' },
  { code: 0x08, value: 'け' },
  { code: 0x09, value: 'こ' },
  { code: 0x0a, value: 'さ' },
  { code: 0x0b, value: 'し' },
  { code: 0x0c, value: 'す' },
  { code: 0x0d, value: 'せ' },
  { code: 0x0e, value: 'そ' },
  { code: 0x0f, value: 'た' },
  { code: 0x10, value: 'ち' },
  { code: 0x11, value: 'つ' },
  { code: 0x12, value: 'て' },
  { code: 0x13, value: 'と' },
  { code: 0x14, value: 'な' },
  { code: 0x15, value: 'に' },
  { code: 0x16, value: 'ぬ' },
  { code: 0x17, value: 'ね' },
  { code: 0x18, value: 'の' },
  { code: 0x19, value: 'は' },
  { code: 0x1a, value: 'ひ' },
  { code: 0x1b, value: 'ふ' },
  { code: 0x1c, value: 'へ' },
  { code: 0x1d, value: 'ほ' },
  { code: 0x1e, value: 'ま' },
  { code: 0x1f, value: 'み' },
  { code: 0x20, value: 'む' },
  { code: 0x21, value: 'め' },
  { code: 0x22, value: 'も' },
  { code: 0x23, value: 'や' },
  { code: 0x24, value: 'ゆ' },
  { code: 0x25, value: 'よ' },
  { code: 0x26, value: '、' },
  { code: 0x27, value: '。' },
  { code: 0x28, value: 'ら' },
  { code: 0x29, value: 'り' },
  { code: 0x2a, value: 'る' },
  { code: 0x2b, value: 'れ' },
  { code: 0x2c, value: 'ろ' },
  { code: 0x2d, value: 'わ' },
  { code: 0x2e, value: 'を' },
  { code: 0x2f, value: 'ん' },
  { code: 0x30, value: '〜' },
  { code: 0x31, value: '♥', special: 2 },
  { code: 0x32, value: 'が' },
  { code: 0x33, value: 'ぎ' },
  { code: 0x34, value: 'ぐ' },
  { code: 0x35, value: 'げ' },
  { code: 0x36, value: 'ご' },
  { code: 0x37, value: 'ざ' },
  { code: 0x38, value: 'じ' },
  { code: 0x39, value: 'ず' },
  { code: 0x3a, value: 'ぜ' },
  { code: 0x3b, value: 'ぞ' },
  { code: 0x3c, value: 'だ' },
  { code: 0x3d, value: 'ぢ' },
  { code: 0x3e, value: 'づ' },
  { code: 0x3f, value: 'で' },
  { code: 0x40, value: 'ど' },
  { code: 0x41, value: 'ば' },
  { code: 0x42, value: 'び' },
  { code: 0x43, value: 'ぶ' },
  { code: 0x44, value: 'べ' },
  { code: 0x45, value: 'ぼ' },
  { code: 0x46, value: 'ぱ' },
  { code: 0x47, value: 'ぴ' },
  { code: 0x48, value: 'ぷ' },
  { code: 0x49, value: 'ぺ' },
  { code: 0x4a, value: 'ぽ' },
  { code: 0x4b, value: 'っ' },
  { code: 0x4c, value: 'ゃ' },
  { code: 0x4d, value: 'ゅ' },
  { code: 0x4e, value: 'ょ' },
  { code: 0x4f, value: '・' },
  { code: 0x50, value: 'ぁ' },
  { code: 0x51, value: 'ぃ' },
  { code: 0x52, value: 'ぅ' },
  { code: 0x53, value: 'ぇ' },
  { code: 0x54, value: 'ぉ' },
  { code: 0x55, value: 'ア' },
  { code: 0x56, value: 'イ' },
  { code: 0x57, value: 'ウ' },
  { code: 0x58, value: 'エ' },
  { code: 0x59, value: 'オ' },
  { code: 0x5a, value: 'カ' },
  { code: 0x5b, value: 'キ' },
  { code: 0x5c, value: 'ク' },
  { code: 0x5d, value: 'ケ' },
  { code: 0x5e, value: 'コ' },
  { code: 0x5f, value: 'サ' },
  { code: 0x60, value: 'シ' },
  { code: 0x61, value: 'ス' },
  { code: 0x62, value: 'セ' },
  { code: 0x63, value: 'ソ' },
  { code: 0x64, value: 'タ' },
  { code: 0x65, value: 'チ' },
  { code: 0x66, value: 'ツ' },
  { code: 0x67, value: 'テ' },
  { code: 0x68, value: 'ト' },
  { code: 0x69, value: 'ナ' },
  { code: 0x6a, value: 'ニ' },
  { code: 0x6b, value: 'ヌ' },
  { code: 0x6c, value: 'ネ' },
  { code: 0x6d, value: 'ノ' },
  { code: 0x6e, value: 'ハ' },
  { code: 0x6f, value: 'ヒ' },
  { code: 0x70, value: 'フ' },
  { code: 0x71, value: 'ヘ' },
  { code: 0x72, value: 'ホ' },
  { code: 0x73, value: 'マ' },
  { code: 0x74, value: 'ミ' },
  { code: 0x75, value: 'ム' },
  { code: 0x76, value: 'メ' },
  { code: 0x77, value: 'モ' },
  { code: 0x78, value: 'ヤ' },
  { code: 0x79, value: 'ユ' },
  { code: 0x7a, value: 'ヨ' },
  { code: 0x7b, value: '!', special: 2 },
  { code: 0x7c, value: '?', special: 2 },
  { code: 0x7d, value: 'ラ' },
  { code: 0x7e, value: 'リ' },
  { code: 0x7f, value: 'ル' },
  { code: 0x80, value: 'レ' },
  { code: 0x81, value: 'ロ' },
  { code: 0x82, value: 'ワ' },
  { code: 0x83, value: 'ヲ' },
  { code: 0x84, value: 'ン' },
  { code: 0x85, value: 'ヴ' },
  { code: 0x86, value: ' ', special: 3 },
  { code: 0x87, value: 'ガ' },
  { code: 0x88, value: 'ギ' },
  { code: 0x89, value: 'グ' },
  { code: 0x8a, value: 'ゲ' },
  { code: 0x8b, value: 'ゴ' },
  { code: 0x8c, value: 'ザ' },
  { code: 0x8d, value: 'ジ' },
  { code: 0x8e, value: 'ズ' },
  { code: 0x8f, value: 'ゼ' },
  { code: 0x90, value: 'ゾ' },
  { code: 0x91, value: 'ダ' },
  { code: 0x92, value: 'ヂ' },
  { code: 0x93, value: 'ヅ' },
  { code: 0x94, value: 'デ' },
  { code: 0x95, value: 'ド' },
  { code: 0x96, value: 'バ' },
  { code: 0x97, value: 'ビ' },
  { code: 0x98, value: 'ブ' },
  { code: 0x99, value: 'ベ' },
  { code: 0x9a, value: 'ボ' },
  { code: 0x9b, value: 'パ' },
  { code: 0x9c, value: 'ピ' },
  { code: 0x9d, value: 'プ' },
  { code: 0x9e, value: 'ペ' },
  { code: 0x9f, value: 'ポ' },
  { code: 0xa0, value: 'ッ' },
  { code: 0xa1, value: 'ャ' },
  { code: 0xa2, value: 'ュ' },
  { code: 0xa3, value: 'ョ' },
  { code: 0xa4, value: 'ー' },
  { code: 0xa5, value: 'ァ' },
  { code: 0xa6, value: 'ィ' },
  { code: 0xa7, value: 'ゥ' },
  { code: 0xa8, value: 'ェ' },
  { code: 0xa9, value: 'ォ' },
  { code: 0xaa, value: 'A' },
  { code: 0xab, value: 'B' },
  { code: 0xac, value: 'C' },
  { code: 0xad, value: 'D' },
  { code: 0xae, value: 'E' },
  { code: 0xaf, value: 'F' },
  { code: 0xb0, value: 'G' },
  { code: 0xb1, value: 'H' },
  { code: 0xb2, value: 'I' },
  { code: 0xb3, value: 'J' },
  { code: 0xb4, value: 'K' },
  { code: 0xb5, value: 'L' },
  { code: 0xb6, value: 'M' },
  { code: 0xb7, value: 'N' },
  { code: 0xb8, value: 'O' },
  { code: 0xb9, value: 'P' },
  { code: 0xba, value: 'Q' },
  { code: 0xbb, value: 'R' },
  { code: 0xbc, value: 'S' },
  { code: 0xbd, value: 'T' },
  { code: 0xbe, value: 'U' },
  { code: 0xbf, value: 'V' },
  { code: 0xc0, value: 'W' },
  { code: 0xc1, value: 'X' },
  { code: 0xc2, value: 'Y' },
  { code: 0xc3, value: 'Z' },
  { code: 0xc4, value: '_' },
  { code: 0xc5, value: '\'' },
  { code: 0xc6, value: ',' },
  { code: 0xc7, value: '.' },
  { code: 0xc8, value: 'a' },
  { code: 0xc9, value: 'b' },
  { code: 0xca, value: 'c' },
  { code: 0xcb, value: 'd' },
  { code: 0xcc, value: 'e' },
  { code: 0xcd, value: 'f' },
  { code: 0xce, value: 'g' },
  { code: 0xcf, value: 'h' },
  { code: 0xd0, value: 'i' },
  { code: 0xd1, value: 'j' },
  { code: 0xd2, value: 'k' },
  { code: 0xd3, value: 'l' },
  { code: 0xd4, value: 'm' },
  { code: 0xd5, value: 'n' },
  { code: 0xd6, value: 'o' },
  { code: 0xd7, value: 'p' },
  { code: 0xd8, value: 'q' },
  { code: 0xd9, value: 'r' },
  { code: 0xda, value: 's' },
  { code: 0xdb, value: 't' },
  { code: 0xdc, value: 'u' },
  { code: 0xdd, value: 'v' },
  { code: 0xde, value: 'w' },
  { code: 0xdf, value: 'x' },
  { code: 0xe0, value: 'y' },
  { code: 0xe1, value: 'z' },
  { code: 0xe2, value: '📱', special: 2},
  { code: 0xe3, value: '😅', special: 2},
  { code: 0xe4, value: '😄', special: 2},
  { code: 0xe5, value: '_' },
  { code: 0xe6, value: '0' },
  { code: 0xe7, value: '1' },
  { code: 0xe8, value: '2' },
  { code: 0xe9, value: '3' },
  { code: 0xea, value: '4' },
  { code: 0xeb, value: '5' },
  { code: 0xec, value: '6' },
  { code: 0xed, value: '7' },
  { code: 0xee, value: '8' },
  { code: 0xef, value: '9' },
  { code: 0xf0, value: '/' },
  { code: 0xf1, value: ':' },
  { code: 0xf2, value: '~' },
  { code: 0xf3, value: '"' },
  { code: 0xf4, value: '@' },

  { code: 0xf5, value: '🔴', special: 8 },
  { code: 0xf6, value: '🟡', special: 8 },
  { code: 0xf7, value: '🟢', special: 8 },
  { code: 0xf8, value: '1️⃣', special: 4, task: 'ones' },
  { code: 0xf9, value: '🔟', special: 4, task: 'tens' },
  { code: 0xfa, value: '💯', special: 4, task: 'hundreds' },
  { code: 0xfb, value: '🔵', special: 8 },
  { code: 0xfc, value: '🟣', special: 8 },
  { code: 0xfd, value: '⏫', special: 5, task: 'bold' },
  { code: 0xfe, value: '⏬', special: 5, task: 'slim' },
  { code: 0xff, value: '🛑', special: 1, task: 'term' },
];

