
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

  input.addEventListener('keyup', update)
  input.addEventListener('blur', update)
  input.addEventListener('change', update)

  window.setTimeout(() => {
    init();
    update();
  }, 200);
})
