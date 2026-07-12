export const approach = {
  eyebrow: "What it taught me",
  title: "Four things I believe and where I learned them",
  note: "",

  tenets: [
    {
      title: "Measure before you change anything",
      body: "I did not and it cost a week. I optimised the batch because the batch was the obvious suspect and the batch was innocent. Every performance number I claim now started as a baseline someone else can reproduce.",
      anchor: "/incident#beat-wrong-question",
      anchorLabel: "the week I wasted",
    },
    {
      title: "A system should tell you when it is struggling",
      body: "The deep queue was designed to protect the service and instead it hid the truth until the truth was unfixable. Given the choice between a system that fails loudly and one that degrades quietly, take the loud one every time.",
      anchor: "/incident#beat-backpressure",
      anchorLabel: "shrinking the queue",
    },
    {
      title: "Say where you were wrong",
      body: "I shipped a simplification that made the code faster and stopped it doing part of its job. I caught it, reverted it and put it back correctly. That sequence is on this site because a portfolio containing only the wins tells you nothing about how someone works when they are wrong.",
      anchor: "/incident#beat-wrong-turn",
      anchorLabel: "the wrong fix",
    },
    {
      title: "Fix the class, not the instance",
      body: "An incident is closed when the same failure cannot happen again and when the next person can diagnose its cousins without me. Usually that means a test. Sometimes it means building the instrument you wished you had on the first day.",
      anchor: "/incident#beat-the-class",
      anchorLabel: "the profiler",
    },
  ],
};
