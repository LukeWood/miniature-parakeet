import Toastify from 'toastify-js';

import './banner.scss';

function show_error_banner(text: string) {
  if (typeof text == "object") {
    text = JSON.stringify(text);
  }
  console.error(text);
  Toastify(
    {
      text: text,
      close: true,
      duration: 5000,
      backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
    },
  ).showToast();
}

export {show_error_banner};
