export function getUriFrontend(extendUriBase: string): [boolean, string] {
  try {
    const uriBase =
      import.meta.env.VITE_FRONTEND_URI || 'http://localhost:3020';
    const uriComposed = `${uriBase}${extendUriBase}`;
    const uriFrontend = new URL(uriComposed);
    if (uriFrontend.href) {
      return [true, uriFrontend.href];
    }
    return [false, ''];
  } catch (error) {
    return [false, ''];
  }
}

export function getLocalUri(extendUriBase: string): [boolean, string] {
  try {
    // clean extenduribase in case contains localhost
    // and not add 2 localhost:3010
    if (extendUriBase.includes('localhost:3010')) {
      // dev development
      const splitedUriBase = extendUriBase.split('localhost:3010')[1];
      if (!splitedUriBase) return [false, ''];

      extendUriBase = splitedUriBase;
    }
    return [true, extendUriBase];
  } catch (error) {
    return [false, ''];
  }
}
