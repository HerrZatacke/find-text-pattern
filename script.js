const intlSplit = (str) => {
  const itr = new Intl.Segmenter("en", {granularity: 'grapheme'}).segment(str);
  return Array.from(itr, ({segment}) => segment);
}

const hex2dig = (code) => {
  return code.split(' ').map((hex) => parseInt(hex, 16));
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

const romPart = 'FD 25 02 09 0E 86 67 A6 A0 9C A4 18 86 86 86 FD 31 E7 EB 9B 8E 7F 31 86 1C 27 FF FD 01 4B 05 01 86 E8 EB B4 D0 DB DB 3C 25 27 FD 00 0E 2F 3F 1F 2A 7C FF FD 40 2B 3F 00 0E 43 7C 86 86 86 86 86 86 86 FD FF FD 9B 6C 7F 2E 86 02 36 05 0B 12 86 86 86 86 FD 22 13 15 22 40 0D 41 05 2F 0D 01 3C 25 27 FF FD 19 23 07 3F 06 0F 28 86 0F 07 0A 2F 86 86 FD B4 D0 DB DB 2E 86 00 35 2A 25 27 FF FD 0E 2B 38 4C 00 86 32 2F 41 4B 12 7B 86 86 FD FF FD 04 23 4B 7C 86 86 86 86 86 86 86 86 86 86 FD B4 D0 DB DB 32 86 0F 29 14 01 25 27 FF FD 0E 2B 38 4C 00 86 1E 0F 06 12 17 27 86 86 FD 96 56 96 56 7B FF FD 04 21 3F 13 02 7B 7B 86 86 86 86 86 86 86 FD FA F9 F8 B4 D0 DB DB 86 9D 80 8F 84 68 7B FF FD 0E 2B 05 28 86 56 7D 61 68 EB 1E 01 86 86 FD 05 2F 0D 01 86 04 21 3F 13 02 7B FF FD 11 33 05 28 86 00 0F 28 0B 07 86 86 86 86 FD 4F 5A 76 7D 4F 86 32 03 28 44 2A 25 27 FF FD 1E 3C 86 13 10 4D 02 3C 08 40 86 86 86 86 FD 23 21 10 4C 02 18 7C FF FD 9D 7E 84 68 0B 0F 29 86 0B 4C 0B 2F 2E 86 FD 13 4B 0F 29 0C 2A 13 86 01 01 25 27 FF FD 25 02 09 0E 86 5B A1 60 A4 18 86 86 86 86 FD 31 61 5C 7D A0 65 5A A4 95 31 86 1C 27 FF FD 01 10 1E 01 86 E7 E6 B4 D0 DB DB 25 27 86 FD 23 4B 12 1F 2A 7C FF FD E8 05 0B 4E 03 28 2F 3F 86 86 86 86 86 86 FD 04 14 38 22 18 2E 86 0E 2C 03 12 17 31 FF FD 00 2B 4B 7C 86 86 86 86 86 86 86 86 86 86 FD B4 D0 DB DB 32 86 0F 29 14 01 25 27 FF FD 0E 2B 38 4C 00 86 86 86 86 86 86 86 86 86 FD 1E 0F 86 09 2F 40 17 31 FF FD 7D A0 5B A4 7B 7B 86 86 86 86 86 86 86 86 FD FA F9 F8 B4 D0 DB DB 9D 80 8F 84 68 25 7B FF FD 22 02 01 4B 05 01 86 23 4B 12 1F 2A 7C 86 FD FF FD 1E 3C 86 13 10 4D 02 25 86 86 86 86 86 86 FD 23 21 10 4C 02 7C FF FD 02 30 2F 86 37 2F 17 2F 27 86 86 86 86 86 FD FF FD 3F 22 86 22 02 01 10 40 86 86 86 86 86 86 FD 65 A1 84 61 2E 86 00 35 2A 17 31 FF FD E7 1E 01 86 0B 4C 0B 2F 2E 86 13 2A 13 86 FD E7 B4 D0 DB DB 86 0F 1E 2A 18 25 27 FF FD 0C 36 30 01 7B 7B 86 86 86 86 86 86 86 86 FD FA F9 F8 B4 D0 DB DB 9D 80 8F 84 68 25 7B FF FD 23 4B 0F A4 7B 7B 86 86 86 86 86 86 86 86 FD FA F9 F8 B4 D0 DB DB 9D 80 8F 84 68 25 7B FF';

let selectedText = '';

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('input');
  const output = document.getElementById('output');
  const buttons = document.getElementById('buttons');
  const renderedInput = document.getElementById('rendered');

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
      const dig = hex2dig(code);
      input.value = reverse(dig);
      update();
    })

    const addRomPart = document.createElement('button');
    addRomPart.innerText = 'from 0x1E2D2';
    buttons.appendChild(addRomPart);
    addRomPart.classList.add('clear');
    addRomPart.addEventListener('click', () => {
      const dig = hex2dig(romPart);
      input.value = reverse(dig);
      update();
    })

    const copySelection = document.createElement('button');
    copySelection.innerText = 'copy selection';
    buttons.appendChild(copySelection);
    copySelection.classList.add('clear');
    copySelection.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(selectedText);
      } catch (error) {
        console.error(error.message);
      }
    })
  }

  const updateSelect = () => {
    selectedText = getSelection()
      .toString()
      .split('\n')
      .join('')
      .split('␣')
      .join(' ');
  }

  const update = () => {
    const chars = intlSplit(input.value || input.placeholder)

    const mapped = chars.map((char) => {
      return charMap.find(({value}) => char === value) || null;
    });

    const numeric = mapped.map((item) => {
      return item ? item.code : null;
    });

    const hex = numeric.map((code) => {
      if (code === null) return '####'
      return code.toString(16).padStart(2, '0');
    });

    output.innerText = hex.join(' ');


    renderedInput.innerHTML = '';
    let loopClass = 'norm';
    mapped.forEach((mappedChar, index) => {
      const cellNode = document.createElement('div');
      const charNode = document.createElement('div');

      if (mappedChar !== null) {
        if (mappedChar.task) {
          switch (mappedChar.task) {
            case 'ones':
            case 'tens':
            case 'hundreds':
              charNode.innerText = 'n';
              charNode.classList.add('digit');
              cellNode.appendChild(charNode);
              break;
            case 'bold':
              loopClass = 'bold';
              return;
            case 'slim':
              loopClass = 'norm';
              return;
            case 'term':
              cellNode.classList.add('term');
              loopClass = 'norm';
              break;
          }
        } else {
          if (mappedChar.value !== ' ') {
            charNode.innerText = mappedChar.value;
          } else {
            charNode.classList.add('space');
            charNode.innerText = '␣'
          }
          cellNode.appendChild(charNode);
        }
        charNode.classList.add(loopClass);
      } else {
        charNode.classList.add('error');
      }

      charNode.classList.add('rendered');
      renderedInput.appendChild(cellNode);
    });
  };

  const reverse = (hex) => {
    return hex.map((char) => {
      return charMap.find(({code}) => char === code)?.value || `0x${char.toString(16).padStart(2, '0')}`
    }).join('');
  }

  input.addEventListener('keyup', update)
  input.addEventListener('blur', update)
  input.addEventListener('change', update)

  document.addEventListener('selectionchange', updateSelect);

  window.setTimeout(() => {
    init();
    input.placeholder = reverse(hex2dig('9F 5D A0 68 9D 7E 84 64 18 86 FD 3F 2F 35 2F FE 32 86 19 01 4B 12 01 1E 0C 05 7C'));

    update();
  }, 200);
})
