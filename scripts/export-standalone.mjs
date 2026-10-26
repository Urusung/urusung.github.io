import { readFile,writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
const output=process.argv[2]
if(!output)throw new Error('Pass an absolute output HTML path')
let html=await readFile('dist/index.html','utf8')
const script=html.match(/<script type="module"[^>]+src="([^"]+)"[^>]*><\/script>/)?.[1]
const cssPath=html.match(/<link rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/)?.[1]
function assetPath(url) {
  const asset = url?.match(/(?:^|\/)(assets\/[^?#]+)(?:[?#].*)?$/)?.[1]
  if (!asset || asset.includes('..')) throw new Error('Unexpected build asset path')
  return 'dist/' + asset
}
const js=await readFile(assetPath(script),'utf8')
let css=await readFile(assetPath(cssPath),'utf8')
const font=(await readFile('public/fonts/PretendardVariable.woff2')).toString('base64')
css=css.replace(/url\((['"]?)[^)'"\s]*PretendardVariable\.woff2\1\)/g,()=>`url(data:font/woff2;base64,${font})`)
html=html.replace(/<link rel="preload"[^>]+>/,'').replace(/<link rel="stylesheet"[^>]+>/,()=>`<style>${css}</style>`).replace(/<script type="module"[^>]+><\/script>/,()=>`<script type="module">${js.replaceAll('</script','<\\/script')}</script>`)
const name='woosung-resume.txt'
const files={[name]:(await readFile('dist/'+name)).toString('base64')}
const fileScript=`const fileData=${JSON.stringify(files)};document.addEventListener('click',event=>{const link=event.target.closest('a[download]');if(!link)return;const name=decodeURIComponent(link.getAttribute('href')).split('/').at(-1);if(!fileData[name])return;event.preventDefault();const bytes=Uint8Array.from(atob(fileData[name]),c=>c.charCodeAt(0));const url=URL.createObjectURL(new Blob([bytes]));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});`
html=html.replace('</body>',`<script>${fileScript}</script></body>`)
const licenses = await Promise.all(['public/licenses/shadcn-ui.txt','public/fonts/LICENSE.txt'].map(path=>readFile(path,'utf8')))
html=html.replace('</head>',()=>`<!-- Third-party licenses\n${licenses.join('\n\n').replaceAll('--','—')}\n--></head>`)
await writeFile(resolve(output),html)
console.log('Exported public portfolio:',output)
