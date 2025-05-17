let tl = gsap.timeline();
tl.from(".logo",{
    opacity:0,
    duration:1,
    y:-20,
    delay:0.3
})
tl.from(".gsap",{
    opacity:0,
    duration:1,
    y:-20,
    stagger:0.3,
})

const handleUrl = (url)=>{
    window.location = url;
}