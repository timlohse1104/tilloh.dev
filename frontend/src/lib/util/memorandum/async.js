const fetchJson = async (url) => {
  try {
    let responseObj = await fetch(url, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    return responseObj.json();
  } catch (err) {
    alert(err);
  }
};

const fetchHtml = async (url) => {
  try {
    let responseObj = await fetch(url, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    return responseObj.text();
  } catch (err) {
    alert(err);
  }
};

export { fetchHtml, fetchJson };
