const test=require("node:test"),assert=require("node:assert/strict");
test("approved USD catalog prices, precise per-piece totals and add-on quantities",async()=>{
 const {experiences,experiencePieceCents,experienceRequestTotal}=await import("../src/lib/experiences.ts");
 const p=experiences[0], [explorer,artisan,master,custom]=p.packages;
 assert.equal(p.packages.filter(x=>x.price).reduce((n,x)=>n+x.pieces.length,0),12);
 assert.deepEqual(p.packages.map(x=>x.minutes),[45,60,90,120]);
 for(const [pkg,expected] of [[explorer,1880],[master,3280]])for(const piece of pkg.pieces)assert.equal(experiencePieceCents(pkg,piece.id),expected);
 for(const piece of artisan.pieces)assert.equal(experiencePieceCents(artisan,piece.id),piece.id==="tshirt"?2880:2580);
 assert.equal(experienceRequestTotal(p,artisan.id,["silk-scarf","tshirt"],{"hair-ties":1}),6740);
 assert.equal(experienceRequestTotal(p,explorer.id,["square-scarf","bucket-hat"],{pouch:2,"hair-ties":1}),7000);
 assert.equal(experienceRequestTotal(p,custom.id,["tablecloth"],{}),null);
 assert.equal(experienceRequestTotal(p,artisan.id,["bogus"],{}),null);
 assert.equal(experienceRequestTotal(p,artisan.id,["tshirt"],{pouch:2}),null);
 assert.equal(experienceRequestTotal(p,artisan.id,["tshirt"],{bogus:1}),null);
});
