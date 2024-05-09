const intlSplit = (str) => {
  const itr = new Intl.Segmenter("en", {granularity: 'grapheme'}).segment(str);
  return Array.from(itr, ({segment}) => segment);
}

const specialTitle = (value) => {
  switch (value) {
    case 1:
      return 'String terminator';
    case 2:
      return 'Graphic';
    case 3:
      return '0x86 = blank space';
    case 4:
      return 'replaced with digit values';
    case 5:
      return 'font change';
    case 6:
    case 7:
    case 8:
      return 'unknown';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('input');
  const output = document.getElementById('output');
  const buttons = document.getElementById('buttons');

  const init = () => {
    charMap.forEach(({ code, value, special }) => {
      const button = document.createElement('button');

      const char = document.createElement('span');
      char.classList.add('char');
      char.innerText = value;

      const hex = document.createElement('span');
      hex.classList.add('hex');
      hex.innerText = `0x${code.toString(16).toUpperCase().padStart(2, '0')}`;

      buttons.appendChild(button);
      if (special) {
        button.classList.add(`special-${special}`);
        button.title = specialTitle(special);
      }
      button.appendChild(char);
      button.appendChild(hex);
      button.addEventListener('click', () => {
        input.value = input.value + value;
        update();
      })
    })

    const clearButton = document.createElement('button');
    clearButton.innerText = 'clear';
    buttons.appendChild(clearButton);
    clearButton.classList.add('clear');
    clearButton.addEventListener('click', () => {
      input.value = '';
      update();
    })

    const fromHexButton = document.createElement('button');
    fromHexButton.innerText = 'code';
    buttons.appendChild(fromHexButton);
    fromHexButton.classList.add('clear');
    fromHexButton.addEventListener('click', () => {
      const code = window.prompt('your hex code');
      const hexed = code.split(' ').map((hex) => parseInt(hex, 16));
      input.value = reverse(hexed);
      update();
    })
  }

  const update = () => {
    output.innerText = intlSplit(input.value || input.placeholder).map((char) => {
      console.log(char);
      return charMap.find(({value}) => char === value)?.code.toString(16).padStart(2, '0') || '####'
    }).join(' ');
  };

  const reverse = (hex) => {
    return hex.map((char) => {
      return charMap.find(({code}) => char === code)?.value || `0x${char.toString(16).padStart(2, '0')}`
    }).join('');
  }

  input.addEventListener('keyup', update)
  input.addEventListener('blur', update)
  input.addEventListener('change', update)

  window.setTimeout(() => {
    init();
    // input.placeholder = reverse([0x9F, 0x5D, 0xA0, 0x68, 0x9D, 0x7E, 0x84, 0x64, 0x18, 0x86, 0x3F, 0x2F, 0x35, 0x2F, 0x32, 0x86, 0x19, 0x01, 0x4B, 0x12, 0x01, 0x1E, 0x0C, 0x05, 0x7C]);
    input.placeholder = reverse([0x9F, 0x5D, 0xA0, 0x68, 0x9D, 0x7E, 0x84, 0x64, 0x18, 0x86, 0xFD, 0x3F, 0x2F, 0x35, 0x2F, 0xFE, 0x32, 0x86, 0x19, 0x01, 0x4B, 0x12, 0x01, 0x1E, 0x0C, 0x05, 0x7C]);
    update();
  }, 200);
})
