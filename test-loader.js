const src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop";
const width = 640;
const url = new URL(src);
url.searchParams.set('w', width.toString());
url.searchParams.set('auto', 'format');
url.searchParams.set('q', "75");
console.log(url.toString());
