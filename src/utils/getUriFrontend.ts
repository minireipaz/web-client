export function getUriFrontend(extendUriBase: string): [boolean, string] {
  try {
    const uriBase =
      import.meta.env.VITE_FRONTEND_URI || "http://localhost:3020";
    const uriComposed = `${uriBase}${extendUriBase}`;
    const uriFrontend = new URL(uriComposed);
    if (uriFrontend.href) {
      return [true, uriFrontend.href];
    }
    return [false, ""];
  } catch (error) {
    console.log("error:", error);
    return [false, ""];
  }
}

export function getLocalUri(extendUriBase: string): {
  ok: boolean;
  relURI: string;
} {
  try {
    if (!extendUriBase.includes("localhost:3010")) {
      return { ok: true, relURI: extendUriBase };
    }
    const [, cleanedUri] = extendUriBase.split("localhost:3010");
    if (!cleanedUri) return { ok: false, relURI: "" };
    return { ok: true, relURI: cleanedUri };
  } catch (error) {
    console.log("error:", error);
    return { ok: false, relURI: "" };
  }
}

// export function getLocalUri(extendUriBase: string): [boolean, string] {
//   try {
//     // clean extenduribase in case contains localhost
//     // and not add 2 localhost:3010
//     if (extendUriBase.includes("localhost:3010")) {
//       // dev development
//       const splitedUriBase = extendUriBase.split("localhost:3010")[1];
//       if (!splitedUriBase) return [false, ""];

//       extendUriBase = splitedUriBase;
//     }
//     return [true, extendUriBase];
//   } catch (error) {
//     console.log("error:", error);
//     return [false, ""];
//   }
// }
