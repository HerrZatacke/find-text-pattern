
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('input');
  const output = document.getElementById('output');
  const buttons = document.getElementById('buttons');

  const init = () => {
    charMap.forEach(({ value }) => {
      const button = document.createElement('button');
      button.innerText = value;
      buttons.appendChild(button);
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
  }

  const update = () => {
    output.innerText = (input.value || input.placeholder).split('').map((char) => {
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
    input.placeholder = reverse([0x9F, 0x5D, 0xA0, 0x68, 0x9D, 0x7E, 0x84, 0x64, 0x18, 0x86, 0x3F, 0x2F, 0x35, 0x2F, 0x32, 0x86, 0x19, 0x01, 0x4B, 0x12, 0x01, 0x1E, 0x0C, 0x05, 0x7C]);
    update();
  }, 200);
})
