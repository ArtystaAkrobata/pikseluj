'use strict';
// Prywatne fotografie ukończonych prac: lokalny IndexedDB, poza localStorage i chmurą.
// Klucz: wzór/rewizja, identyczny jak dla wpisów w albumie.
const PikselujPhotos=(()=>{
  const DB_NAME='pikseluj-zdjecia-albumu-v1';
  const STORE='zdjecia';
  let dbPromise=null;
  function connect(){
    if(!('indexedDB' in window))return Promise.reject(new Error('Ta przeglądarka nie obsługuje zapisywania zdjęć.'));
    if(dbPromise)return dbPromise;
    dbPromise=new Promise((resolve,reject)=>{
      const req=window.indexedDB.open(DB_NAME,1);
      req.onupgradeneeded=()=>{
        const db=req.result;
        if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE);
      };
      req.onsuccess=()=>{
        const db=req.result;
        db.onversionchange=()=>{db.close();dbPromise=null;};
        resolve(db);
      };
      req.onerror=()=>reject(req.error||new Error('Błąd otwierania albumu zdjęć.'));
      req.onblocked=()=>reject(new Error('Zamknij inne karty Pikseluj i spróbuj ponownie.'));
    }).catch(error=>{dbPromise=null;throw error});
    return dbPromise;
  }
  async function request(mode,method,key,value){
    const db=await connect();
    return new Promise((resolve,reject)=>{
      let result,done=false;
      const tx=db.transaction(STORE,mode);
      const store=tx.objectStore(STORE);
      const req=method==='put'?store.put(value,key):method==='delete'?store.delete(key):store.get(key);
      req.onsuccess=()=>{result=req.result;};
      tx.oncomplete=()=>{done=true;resolve(result)};
      tx.onabort=()=>{if(!done)reject(tx.error||new Error('Nie udało się zapisać zdjęcia.'))};
      tx.onerror=()=>{if(!done)reject(tx.error||new Error('Błąd pamięci urządzenia.'))};
    });
  }
  async function prepare(file){
    if(!(file instanceof Blob)||!(file.type||'').startsWith('image/')){
      throw new Error('Wybierz zdjęcie w formacie obrazu.');
    }
    if(file.size>32*1024*1024)throw new Error('Zdjęcie jest zbyt duże (ponad 32 MB).');
    // Obraz pozostaje wystarczająco szczegółowy do obejrzenia rysunku,
    // ale nie zajmuje kilkunastu MB jak zdjęcie prosto z aparatu.
    let decoded;
    let sourceUrl=null;
    try{
      if(typeof createImageBitmap==='function'){
        try{decoded=await createImageBitmap(file,{imageOrientation:'from-image'})}
        catch{decoded=null}
      }
      if(!decoded){
        sourceUrl=URL.createObjectURL(file);
        decoded=await new Promise((resolve,reject)=>{
          const image=new Image();
          image.onload=()=>resolve(image);
          image.onerror=()=>reject(new Error('Nie udało się otworzyć zdjęcia.'));
          image.src=sourceUrl;
        });
      }
      const w=decoded.width||decoded.naturalWidth,h=decoded.height||decoded.naturalHeight;
      if(!w||!h)throw new Error('Zdjęcie ma nieprawidłowe wymiary.');
      const scale=Math.min(1,1600/Math.max(w,h));
      const canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(w*scale));
      canvas.height=Math.max(1,Math.round(h*scale));
      const ctx=canvas.getContext('2d',{alpha:false});
      if(!ctx)throw new Error('Nie udało się przygotować zdjęcia.');
      ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
      ctx.drawImage(decoded,0,0,canvas.width,canvas.height);
      const jpeg=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.83));
      if(!jpeg||!jpeg.size)throw new Error('Nie udało się zmniejszyć zdjęcia.');
      return jpeg;
    }finally{
      if(decoded&&typeof decoded.close==='function')decoded.close();
      if(sourceUrl)URL.revokeObjectURL(sourceUrl);
    }
  }
  return Object.freeze({
    supported:()=>typeof window.indexedDB!=='undefined',
    get:key=>request('readonly','get',key),
    save:(key,blob)=>request('readwrite','put',key,blob),
    remove:key=>request('readwrite','delete',key),
    prepare
  });
})();