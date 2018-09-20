import { Fixture } from '@xinix/xin/components/fixture';
import { Lang } from '..';
import assert from 'assert';

describe('xin-lang', () => {
  it('render', async () => {
    window.lang = new Lang({
      translations: {
        en: {
          foo: 'English foo',
        },

        id: {
          foo: 'Foo Bahasa Indonesia',
        },
      },
    });

    {
      let fixture = await Fixture.create(`
        <span id="foo">[[__global.lang.translate("foo")]]</span>
      `);

      try {
        await fixture.waitConnected();

        assert.strictEqual(fixture.$.foo.textContent, 'English foo');
      } finally {
        fixture.dispose();
      }
    }

    {
      window.lang.value = 'id';

      let fixture = await Fixture.create(`
        <span id="foo">[[__global.lang.translate("foo")]]</span>
      `);

      try {
        await fixture.waitConnected();

        assert.strictEqual(fixture.$.foo.textContent, 'Foo Bahasa Indonesia');
      } finally {
        fixture.dispose();
      }
    }

    {
      window.lang.value = 'ru';

      let fixture = await Fixture.create(`
        <span id="foo">[[__global.lang.translate("foo")]]</span>
      `);

      try {
        await fixture.waitConnected();

        assert.strictEqual(fixture.$.foo.textContent, 'foo');
      } finally {
        fixture.dispose();
      }
    }

    {
      window.lang.putTranslations('ru', {
        foo: 'i dont speak russian',
      });

      let fixture = await Fixture.create(`
        <span id="foo">[[__global.lang.translate("foo")]]</span>
      `);

      try {
        await fixture.waitConnected();

        assert.strictEqual(fixture.$.foo.textContent, 'i dont speak russian');
      } finally {
        fixture.dispose();
      }
    }
  });

  it('render with parameter', async () => {
    window.lang = new Lang({
      translations: {
        en: {
          'User {0} {1}': '{1}, {0} as user',
        },

        id: {
          'User {0} {1}': 'Pengguna {0} {1}',
        },
      },
    });

    {
      let fixture = await Fixture.create(`
        <span id="foo">[[__global.lang.translate("User {0} {1}", user.firstname, user.lastname)]]</span>
      `);

      try {
        await fixture.waitConnected();

        fixture.set('user', {
          firstname: 'John',
          lastname: 'Doe',
        });

        assert.strictEqual(fixture.$.foo.textContent, 'Doe, John as user');

        window.lang.value = 'id';

        fixture.set('user', {
          firstname: 'Jane',
          lastname: 'Doe',
        });

        assert.strictEqual(fixture.$.foo.textContent, 'Pengguna Jane Doe');
      } finally {
        fixture.dispose();
      }
    }
  });
});
