export const incident = {
  eyebrow: "One problem, in detail",
  title: "The queue was lying to us",
  standfirst:
    "A batch pipeline got five times faster and started timing out. This is how I found the bug, including the week I spent looking in the wrong place.",
  system: "A batch job feeding a search index",
  stack: "Java · thread pools · relational store",

  teaser:
    "A batch pipeline got five times faster and started timing out. Six months, one wasted week, one fix that made things worse, and a profiler nobody has had to build again.",

  beats: [
    {
      id: "symptom",
      kind: "fault",
      marker: "Symptom",
      title: "Faster, and failing",
      body: "We split the work into parallel batches and it got three to five times quicker. Then the reports came in. Clients weren't seeing slow responses, they were seeing cancelled ones. The server had stopped answering altogether.",
    },
    {
      id: "wrong-question",
      kind: "neutral",
      marker: "The wrong question",
      title: "I spent a week asking why the batch was slow",
      body: "It was the wrong question. The batch was fine. Nothing in it had regressed, and every number I could find said the work was getting done. What I had not asked was who was doing it.",
    },
    {
      id: "root-cause",
      kind: "fault",
      marker: "Root cause",
      title: "The thread pool had a trapdoor",
      body: "When a Java thread pool's queue fills up, it has to do something with the next task. The default is `CallerRunsPolicy`: hand the work back to whoever submitted it. The submitter was the HTTP request thread. So under load the web server stopped serving requests and started running batches itself, for the entire duration of one.",
      pull: "A pool that runs work on the caller isn't a thread pool. It's a trapdoor. The system's response to being overloaded was to disable the part that talks to users.",
      note: "What made it invisible for months: throughput never fell. Handing a batch to the request thread adds a worker, so every graph we were watching looked healthy or better. The only thing that degraded was the one thing nobody had a graph for. Whether the server was still answering.",
    },
    {
      id: "backpressure",
      kind: "good",
      marker: "The fix that looks wrong",
      title: "I made the queue smaller",
      body: "Five hundred slots down to thirty. A deep queue does not absorb load, it conceals it. Work sits invisible for minutes while every dashboard reads green, and by the time you feel it the backlog is unrecoverable. A shallow queue tells you it is full while you can still do something about it. Then the pool blocks the dispatcher instead of ambushing the caller.",
      note: "Backpressure is not a failure mode. It is the system keeping its promises.",
    },
    {
      id: "wrong-turn",
      kind: "fault",
      marker: "Where I got it wrong",
      title: "I removed the work instead of fixing it",
      body: "The batch walked a nested relationship, and that walk looked like the source of the repeated queries. So I took it out. The code was simpler, the run was faster, and it had quietly stopped doing a job it was there to do. Nothing failed. Nothing warned.",
      pull: "Simpler is not the same as correct. Removing work is only a fix if the work was never needed.",
      note: "The traversal was never the problem. The N+1 hiding inside it was. Put the traversal back, then fetch the children in one query instead of N.",
    },
    {
      id: "the-class",
      kind: "good",
      marker: "The class, not the instance",
      title: "So nobody would have to guess again",
      body: "By then two of us had spent weeks guessing which layer was slow. I wrote a profiler into the batch entry points. Every run emits one line of non-overlapping timings: store read, object mapping, external enrichment, index write, and the overhead nobody ever accounts for. Slowest layer, per run, in production, without a debugger.",
      note: "Then the unglamorous part: lazier associations, an explicit fetch plan, reusing rows already sitting in the session cache. Fifty to seventy percent fewer database queries.",
    },
  ],

  outcome: {
    marker: "Where it landed",
    metrics: [
      { value: "10–15×", label: "sync throughput", kind: "good" },
      { value: "50–70%", label: "fewer DB queries", kind: "good" },
      { value: "10k+", label: "records / hour", kind: "good" },
      { value: "1", label: "kill switch", kind: "ember" },
    ],
    coda: "From the first cancelled request to the last fix, about six months. The profiler is still running. Someone else will find the next bottleneck without me.",
  },
};
