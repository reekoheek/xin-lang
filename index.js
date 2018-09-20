export class Lang {
  constructor ({ value = 'en', translations = {} } = {}) {
    this.value = value;
    this.translations = translations;
  }

  putTranslations (value, translations) {
    this.translations[value] = translations;
  }

  removeTranslations (value) {
    delete this.translations[value];
  }

  getMessage (message) {
    if (!this.translations) {
      return message;
    }

    let messages = this.translations[this.value];
    if (!messages) {
      return message;
    }

    return messages[message] || message;
  }

  interpolate (message, ...args) {
    let re = /\{(\d+)\}/g;
    let matches;
    while ((matches = re.exec(message))) {
      let replacement = args[matches[1]] || '';
      message = message.replace(matches[0], replacement);
    }
    return message;
  }

  translate (message, ...args) {
    let translation = this.getMessage(message);
    return this.interpolate(translation, ...args);
  }
}
