export const facePrompts: string[] = [
  // Gratitude & Recognition
  "What's one thing you did today that your past self would be proud of?",
  "Who helped you today, even in a small way?",
  "What worked? What's got momentum right now?",
  "Describe a recent win—big or small. Let yourself feel it.",
  "What are you grateful for in your current storyline?",
  "What's something good you almost forgot to notice today?",
  "Who deserves a thank you that you haven't given yet?",
  "What's one thing going right that you've been taking for granted?",
  // Strength & Character
  "What strength did you use today that you want to use more?",
  "When did you feel most like yourself this week?",
  "What challenge are you actually ready for?",
  "What's a boundary you held that you're proud of?",
  "When did you choose the hard right over the easy wrong?",
  "What did you do today that lined up with who you want to be?",
  "What's something you used to struggle with that's getting easier?",
  "What would your biggest fan say about how you showed up today?",
  // Momentum & Progress
  "What's one small thing you did today that moves you toward The Big One?",
  "Where do you have momentum right now? How can you protect it?",
  "What's clicking? What feels like it's falling into place?",
  "What did you learn this week that you didn't know before?",
  "What's a problem you solved recently that would've wrecked you a year ago?",
  "What's getting clearer the more you work at it?",
  // Connection & Joy
  "What made you laugh recently?",
  "Who are you excited to see or talk to?",
  "What's something you're looking forward to?",
  "When did you feel genuinely connected to someone this week?",
  "What's a small pleasure you actually let yourself enjoy?",
  "What's something beautiful you noticed today?",
  // Vision & Possibility
  "If today was a preview of your future, what part would you want more of?",
  "What's becoming possible that didn't feel possible before?",
];

export const heelPrompts: string[] = [
  // Release & Expression
  "What's sitting heavy right now? Let it out.",
  "What do you need to say that you haven't said out loud?",
  "What's pissing you off? Be specific. Be petty if you need to.",
  "What would you say if no one was listening?",
  "What are you sick of pretending is fine?",
  "Vent. No filter. What's got you heated?",
  "What do you need to complain about without being told to look on the bright side?",
  "Say the thing you're not supposed to say.",
  // Fear & Anxiety
  "What are you afraid of that you keep pushing down?",
  "What's the worst-case scenario you keep playing in your head?",
  "What keeps you up at night?",
  "What are you worried about that feels too stupid to admit?",
  "What future are you scared of?",
  "What's the fear under the fear? Go one layer deeper.",
  // Frustration & Stuckness
  "Where do you feel stuck? Where's the wall?",
  "What do you keep avoiding? Why?",
  "What's not working no matter how hard you try?",
  "What do you wish someone understood about what you're going through?",
  "What's exhausting you?",
  "What are you tired of carrying?",
  // Self-Doubt & Inner Critic
  "What's the heel in your head saying about you right now?",
  "What story are you telling yourself that isn't helping?",
  "Where do you feel like a fraud?",
  "What do you feel like you should be better at by now?",
  "What comparison is eating at you?",
  "What failure do you keep replaying?",
  // Grief & Disappointment
  "What are you mourning that no one knows about?",
  "What didn't turn out the way you hoped?",
  "What do you miss?",
  "What loss are you still carrying?",
];

export const faceFollowUpPrompts: string[] = [
  // Reframe & Respond
  "Now—what would the face say back?",
  "What's one small thing that's still true despite all that?",
  "What's the next right move, even if it's tiny?",
  "If a friend said all that to you, what would you tell them?",
  "What would the version of you who's past this say?",
  "Is there any part of this that's actually protecting you?",
  "What's one thing you can control in this situation?",
  "What would it look like to be gentle with yourself about this?",
  // Finding the Build
  "How might this heat build to something better?",
  "What could this struggle be teaching you?",
  "Is there strength being built here that you can't see yet?",
  "Sometimes the heel has a point. Is there anything useful in what you wrote?",
  "What's the storyline here? Where could this be going?",
  "What would make this worth having gone through?",
  // Grounding
  "What's one thing you know for sure, even right now?",
  "What's still standing? What hasn't broken?",
  "Who's in your corner, even if they don't know you're struggling?",
  "What's one thing you can do in the next hour that would help?",
  "What would 'enough' look like today? Not great—just enough.",
  "What do you need right now? Can you give yourself even a piece of it?",
];

export const getRandomPrompt = (type: 'face' | 'heel'): string => {
  const prompts = type === 'face' ? facePrompts : heelPrompts;
  return prompts[Math.floor(Math.random() * prompts.length)];
};

export const getRandomFollowUpPrompt = (): string => {
  return faceFollowUpPrompts[Math.floor(Math.random() * faceFollowUpPrompts.length)];
};
