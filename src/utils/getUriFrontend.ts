export function getUriFrontend(extendUriBase: string): [boolean, string] {
  try {
    const uriBase = import.meta.env.VITE_FRONTEND_URI || "http://localhost:3020";
    const uriComposed = `${uriBase}${extendUriBase}`;
    const uriFrontend = new URL(uriComposed);
    if (uriFrontend.href) {
      return [true, uriFrontend.href]
    }
    return [false, ""]
  } catch (error) {
    return [false, ""];
  }
}
