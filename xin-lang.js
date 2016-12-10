import xin from 'xin';

class Lang extends xin.Component {
  get props () {
    return Object.assign({}, super.props, {
      value: {
        type: Function,
        notify: true,
      },

      langs: {
        type: Array,
      },

      base: {
        type: String,
        value: 'langs',
      },

      lang: {
        type: String,
        value: '',
        observer: '_langChanged(lang)',
      },
    });
  }

  async attached () {
    this.resources = {};

    if (!this.lang) {
      let lang = window.localStorage['APP_LANG'];

      if (!lang && navigator.languages) {
        lang = navigator.languages.map(this._prep).find(lang => {
          return this.langs.indexOf(lang) !== -1;
        });
      }

      if (!lang) {
        let navLang = this._prep(navigator.language);
        if (this.langs.indexOf(navLang) !== -1) {
          lang = navLang;
        } else {
          lang = this.langs[0] || 'en';
        }
      }

      window.localStorage['APP_LANG'] = lang;
      this.set('lang', lang);
    } else {
      // force notify lang when host ready
      this.notify('lang', this.lang);
    }

    console.info(`Selected language ${this.lang}`);
  }

  _prep (lang) {
    return lang.split('-')[0].toLowerCase();
  }

  async _fetch (lang) {
    if (lang in this.resources) {
      return this.resources[lang];
    }

    let langUrl = new window.URL(this.base + '/' + lang + '.json', window.location.href).href;

    let response = await new Promise(async (resolve, reject) => {
      let xhr = new window.XMLHttpRequest();
      xhr.onload = () => {
        resolve(new window.Response(xhr.responseText, {status: xhr.status}));
      };
      xhr.onerror = () => {
        reject(new TypeError('Local request failed'));
      };
      xhr.open('GET', langUrl);
      xhr.send(null);
    });

    // let response = await window.fetch(langUrl);
    let resource = this.resources[lang] = await response.json();

    return resource;
  }

  async _langChanged (lang) {
    if (lang) {
      let resource = this.resource = await this._fetch(lang);
      this.set('value', message => {
        return resource[message] || message;
      });
    }
  }
}

xin.define('xin-lang', Lang);

export default Lang;
