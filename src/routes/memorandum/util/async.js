let responseObj;

async function fetchJson(url){
    try{
        let responseObj = await fetch(url, {
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
        return responseObj.json();
    } catch(err) {
        alert(err);
    }
}

async function fetchHtml(url){
    try{
        let responseObj = await fetch(url, {
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
        return responseObj.text();
    } catch(err){
        alert(err);
    }
}

export{fetchJson, fetchHtml}