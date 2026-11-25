const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
test("editorial selection is deterministic, published-only, deduplicated and context-sensitive",async()=>{
 const {experiences,experienceStartingPrice}=await import("../src/lib/experiences.ts");
 const {recommendExperiences}=await import("../src/lib/experience-recommendations.ts");
 const p=experiences.find(x=>x.slug==="dali-tie-dye-workshop");
 const draft={...p,slug:"draft",status:"draft"};
 const other={...p,slug:"other",destination:"lijiang",relatedArticles:[]};
 const catalog=[p,draft,other];
 const item=(slug,frontmatter={})=>({slug,kind:"article",frontmatter});
 assert.deepEqual(recommendExperiences(item("dali-travel-guide",{relatedExperiences:[p.slug,p.slug,"draft"]}),catalog).map(x=>x.slug),[p.slug]);
 assert.equal(recommendExperiences(item("zh-version",{translationKey:"dali-hidden-gems-off-the-beaten-path"}),catalog)[0],p);
 assert.equal(recommendExperiences(item("unrelated"),catalog).length,0);
 assert.equal(recommendExperiences(item("dali-to-shaxi",{experienceDestination:"dali",experienceThemes:["arts-and-crafts"]}),catalog,true).length,0);
 assert.equal(recommendExperiences(item("new-craft-guide",{experienceDestination:"dali",experienceThemes:["arts-and-crafts"]}),catalog)[0],p);
 assert.equal(recommendExperiences(item("wrong-place",{experienceDestination:"kunming",experienceThemes:["arts-and-crafts"]}),catalog).length,0);
 assert.equal(experienceStartingPrice(p,"en"),"From US$18.80 / person");
 assert.equal(experienceStartingPrice(p,"zh"),"US$18.80 起 / 人");
 assert.equal(experienceStartingPrice({...p,packages:[]},"en"),"Request a quote");
});
test("P0 articles contain crawlable product links and explicit recommendations",()=>{
 for(const path of ["_posts/dali-travel-guide.md","_posts-zh/dali-travel-guide.md","_posts/dali-hidden-gems-off-the-beaten-path.md","_posts-zh/dali-hidden-gems-off-the-beaten-path.md","_posts/how-many-days-in-yunnan.md"]){
 const s=fs.readFileSync(path,"utf8");assert.match(s,/relatedExperiences:\s*\n\s*- dali-tie-dye-workshop/);assert.match(s,/\]\(\/experiences\/dali-tie-dye-workshop\)/);
 }
});
