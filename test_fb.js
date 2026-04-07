const CONFIG = {
  INSTAGRAM: {
    ACCESS_TOKEN: 'EAAW0gTERCh8BRCpLQXdZB5lucNQSYIuEI7ArzQZAhWrah1GtO0xuRRMwDV2I5uCEH1uVbgEacFqBCOZALvfuWYkUHI6ZCwLAIEDg2MWahU9ZAozfTDOpSH0d003Nwu9T5visZBt2stt8OBG4FETw6gtj6yN6dVXH1LZAegGZAdBUFjaU1ee2RpRD84wjwOCZCAPhkYJZB4LX9InZBZCqiABlIteFKgUvklc9nxVu',
    MEDIA_ID: '18093045233145275',
  }
};

const url = `https://graph.facebook.com/v25.0/${CONFIG.INSTAGRAM.MEDIA_ID}/comments?fields=id,text,username,timestamp&access_token=${CONFIG.INSTAGRAM.ACCESS_TOKEN}`;

fetch(url)
  .then(async res => {
    console.log("Status:", res.status);
    console.log("Response:", await res.json());
  })
  .catch(console.error);
