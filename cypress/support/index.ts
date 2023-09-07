// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    checkUrl: (url: string) => void;
    apiIntercept: (method: string, param: string) => void;
    coveredElementHandler: (selector: string) => void;
    paginationHandler: () => void;
    checkTableHead: (payload: string[]) => void;
    verifyApiResponse: (
      alias: string,
      ...additionalExpects: ((xhr: any) => void)[]
    ) => string;
    getSelector: (
      selector: string,
      ...cypressAction: []
    ) => Chainable<JQuery<HTMLElement>>;
  }
}
