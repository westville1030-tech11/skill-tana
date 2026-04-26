// Next.js 16: params and searchParams are async Promises
export type PageProps<T extends string = string> = {
  params: Promise<ExtractParams<T>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type ExtractParams<T extends string> =
  T extends `${string}/[${infer Param}]/${infer Rest}`
    ? { [K in Param]: string } & ExtractParams<`/${Rest}`>
    : T extends `${string}/[${infer Param}]`
    ? { [K in Param]: string }
    : Record<string, never>;
