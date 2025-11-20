import astroConfig from '~/astro.config';

const plaintextRedirects = `
/calendar/full.ics /calendar/all/generic.ics 301
/calendar/full/apple.ics /calendar/all/apple.ics 301
/meetings/fa2017/2017* /meetings/general/2017:splat 302
/meetings/fa2018/2018* /meetings/general/2018:splat 302
/meetings/fa2019/2019* /meetings/general/2019:splat 302
/meetings/fa2020/2020* /meetings/general/2020:splat 302
/meetings/fa2021/2021* /meetings/general/2021:splat 302
/meetings/fa2022/2022* /meetings/general/2022:splat 302
/meetings/fa2023/2023* /meetings/general/2023:splat 302
/meetings/fa2024/2024* /meetings/general/2024:splat 302
/meetings/sp2017/2017* /meetings/general/2017:splat 302
/meetings/sp2018/2018* /meetings/general/2018:splat 302
/meetings/sp2019/2019* /meetings/general/2019:splat 302
/meetings/sp2020/2020* /meetings/general/2020:splat 302
/meetings/sp2021/2021* /meetings/general/2021:splat 302
/meetings/sp2022/2022* /meetings/general/2022:splat 302
/meetings/sp2023/2023* /meetings/general/2023:splat 302
/meetings/sp2024/2024* /meetings/general/2024:splat 302
/events/* /events-temp/ 302
`;

export function getStaticPaths() {
  return [
    { params: { _redirects: '_redirects' } }
  ];
}

export async function GET() {
  const redirects = astroConfig.redirects || [];
  const redirectLines: string[] = Object.entries(redirects).map(([from, config]) => {
    if (typeof config === 'string') {
      return `${from} ${config} 302`;
    } else if (typeof config?.destination === 'string') {
      const status = config?.status || 302;
      return `${from} ${config.destination} ${status}`;
    } else {
      throw new Error(`Invalid redirect config for path ${from}: ${JSON.stringify(config)}`);
    }
  });
  const finalPlaintextRedirects = redirectLines.join('\n') + '\n' + plaintextRedirects.trim() + '\n';
  return new Response(finalPlaintextRedirects, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}