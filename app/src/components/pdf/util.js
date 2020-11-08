const debounce = (fn, time = 100) => {
  let timer;

  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, time);
  };
};

export { debounce };
