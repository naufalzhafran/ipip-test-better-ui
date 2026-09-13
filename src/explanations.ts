import bank from "./items.json";

// Each row follows the published 300-item facet order. The short form reuses
// explanations by statement, so its different item positions cannot mismatch.
const questionNotes: Record<string, string[]> = {
  N1: [
    "You spend time thinking about what might go wrong, such as a missed deadline or an upcoming conversation.",
    "When something is uncertain, you tend to expect the worst possible outcome.",
    "Many different situations make you feel afraid, rather than just one specific fear.",
    "Ordinary demands, such as a busy day or a change of plans, quickly make you feel tense.",
    "Problems take up so much of your attention that it is hard to think about other things.",
    "Small problems or inconveniences usually do not upset you much.",
    "During a typical day, you usually feel at ease rather than tense or worried.",
    "Unexpected events usually do not shake your sense of calm very much.",
    "After something is over, you usually do not keep worrying about it or replaying it.",
    "You adjust to unfamiliar circumstances, such as a new routine, without much difficulty.",
  ],
  N2: [
    "It does not take much frustration or disagreement for you to start feeling angry.",
    "Small annoyances, such as interruptions or delays, quickly get on your nerves.",
    "Things can quickly leave you feeling bothered or emotionally unsettled.",
    "On many days, you feel grumpy or unpleasant even if there is no single big reason.",
    "When angry, you sometimes stop controlling how you express it, such as snapping or shouting.",
    "Small annoyances usually do not make you feel irritated.",
    "You do not often find yourself feeling angry.",
    "Things that annoy other people may not bother you very much.",
    "You stay composed when something frustrating happens, rather than reacting angrily.",
    "You do not often voice dissatisfaction about things that bother you.",
  ],
  N3: [
    "“Feel blue” means feeling sad or low. Think about how often this describes your usual mood.",
    "You tend to feel negatively about yourself as a person.",
    "“Down in the dumps” means feeling unhappy or low in spirits.",
    "You often judge yourself unfavorably or feel you are not worth very much.",
    "Your mood changes noticeably and often, such as moving from cheerful to upset.",
    "You sometimes feel that things are so difficult that you cannot see a way forward.",
    "You feel unsure about where your life is going or what you are working toward.",
    "You rarely feel sad or low in spirits.",
    "You generally feel at ease with who you are, including your imperfections.",
    "You usually feel satisfied with yourself as a person.",
  ],
  N4: [
    "Other people or challenging situations can quickly make you feel nervous or less confident.",
    "You worry that you will make a mistake or behave in a way that others disapprove of.",
    "Starting a conversation or introducing yourself to someone feels difficult.",
    "Being noticed, such as speaking in front of a group, makes you feel uneasy.",
    "You feel at ease mainly with people you already know well.",
    "When speaking, your words sometimes come out mixed up or less smoothly than you intended.",
    "Awkward moments usually do not make you feel very embarrassed.",
    "You can feel at ease even when the setting or people are new to you.",
    "Awkward conversations or tense social moments do not trouble you very much.",
    "You can speak up for your needs or defend yourself when someone treats you unfairly.",
  ],
  N5: [
    "You often eat more than you intended or more than feels comfortable.",
    "You sometimes act without being able to explain afterward what made you do it.",
    "You sometimes make choices that you later wish you had not made.",
    "A binge is doing a lot of something in one period, such as eating or drinking far beyond your usual amount.",
    "Eating is something you particularly enjoy and look forward to.",
    "You usually stop enjoying something before you have had too much of it.",
    "You can usually turn down something appealing when you have a reason to avoid it.",
    "A strong desire for something does not usually determine what you do next.",
    "Your spending stays within the money you can afford to use.",
    "“Splurge” means spending unusually freely on a treat or luxury. You say you never do this.",
  ],
  N6: [
    "Difficult or unexpected situations quickly make you feel alarmed and unable to stay calm.",
    "When things happen around you, they can feel like more than you can handle.",
    "You feel that the demands you face are beyond your ability to manage.",
    "Choosing between options is difficult, and you may keep going back and forth.",
    "Strong feelings can become so intense that it is hard to think or act clearly.",
    "Even when much is expected of you, you can usually stay composed.",
    "You feel able to work through problems with several difficult parts.",
    "When life is difficult, you usually know ways to manage the situation or your response.",
    "After a disappointment or obstacle, you can get moving again without much difficulty.",
    "You remain composed when the atmosphere is stressful or people are on edge.",
  ],
  E1: [
    "Meeting someone new often develops into a friendship without much effort for you.",
    "You start feeling friendly and comfortable with new people fairly quickly.",
    "Being around other people generally feels comfortable to you.",
    "When you interact with people, your behavior feels relaxed and natural.",
    "You often help someone feel happier when they are sad or discouraged.",
    "Other people may need time and effort to learn what you are really like.",
    "Being with other people often makes you feel uneasy or out of place.",
    "You tend to avoid opportunities to speak with or meet other people.",
    "Learning about other people and their lives does not interest you much.",
    "You limit how close other people get to you emotionally or socially.",
  ],
  E2: [
    "You particularly enjoy celebrations or gatherings with many people.",
    "At a social gathering, you usually chat with many people rather than stay with just one or two.",
    "Being included in a group is something you enjoy.",
    "When doing an activity, you often invite other people to join you.",
    "You enjoy parties that happen as a surprise rather than being planned with you beforehand.",
    "Given a choice, you often prefer spending time by yourself.",
    "You often want other people to give you space instead of keeping you company.",
    "Events packed with people usually feel unappealing to you.",
    "You tend to stay away from places where many people gather.",
    "You look for calm, quiet surroundings instead of busy or noisy ones.",
  ],
  E3: [
    "When something needs organizing, you tend to step in and direct what happens.",
    "You make an effort to guide what a group does.",
    "You can persuade people to do something they were not initially planning to do.",
    "You try to shape other people’s choices, opinions, or actions.",
    "You tend to put yourself in a position to decide how things are done.",
    "You usually let someone else decide what to do before you act.",
    "In a group, you tend to stay less visible rather than take a prominent role.",
    "During conversations, you usually contribute few words.",
    "You prefer not to make yourself the person everyone is noticing.",
    "You often keep your views to yourself instead of saying what you think.",
  ],
  E4: [
    "Your days are generally filled with tasks or activities, with little idle time.",
    "You tend to move from one activity to the next and rarely stay still for long.",
    "Even outside your responsibilities, you fill your time with activities.",
    "You can keep several activities or responsibilities moving at once.",
    "When something happens, you usually respond without much delay.",
    "You enjoy relaxing and avoiding unnecessary effort or hurry.",
    "You prefer doing things at a comfortable pace rather than rushing.",
    "You like a way of living with plenty of unhurried time.",
    "You are comfortable letting things develop naturally without speeding them up.",
    "You tend to take time before responding to what is happening.",
  ],
  E5: [
    "You enjoy experiences that feel thrilling or highly stimulating.",
    "You actively look for unusual or adventurous experiences.",
    "You enjoy being where something lively or exciting is happening.",
    "Being among a noisy, energetic group is enjoyable for you.",
    "You enjoy acting without much concern for possible risks or consequences.",
    "You sometimes behave in a very uninhibited or unpredictable way.",
    "You are open to trying almost any experience at least once.",
    "You deliberately look for experiences that involve danger.",
    "You would not choose activities such as hang gliding or bungee jumping, even if given the opportunity.",
    "Music played at a high volume is unpleasant to you.",
  ],
  E6: [
    "Your happiness is often noticeable to people around you.",
    "Enjoyable and fun experiences are a regular part of your life.",
    "You show delight freely, such as getting visibly excited over something simple.",
    "You often respond to everyday life with laughter and a sense of humor.",
    "You feel a strong enjoyment of being alive and experiencing life.",
    "You tend to notice what is hopeful or positive about a situation.",
    "When you find something funny, you often laugh out loud.",
    "You often make your friends laugh or entertain them.",
    "It takes quite a lot for something to make you laugh or feel entertained.",
    "You do not often make jokes or act playfully.",
  ],
  O1: [
    "You can picture scenes, people, or possibilities clearly in your mind.",
    "You enjoy imagining unusual situations that go far beyond everyday reality.",
    "You enjoy letting your mind wander into imagined scenes or possibilities.",
    "You enjoy becoming deeply absorbed in your own thoughts.",
    "You spend time enjoying things you imagine, even when they are not real.",
    "You take time to think things over and consider their meaning.",
    "Your attention rarely drifts into imagined scenes while you are awake.",
    "Coming up with imagined scenes or possibilities does not come easily to you.",
    "You rarely become so absorbed in thought that you lose track of what is around you.",
    "It is difficult for you to picture something in your mind that is not in front of you.",
  ],
  O2: [
    "You think art has value and deserves a place in people’s lives.",
    "Listening to music is something you enjoy.",
    "You notice attractive details, such as colors or shapes, that other people may overlook.",
    "You particularly enjoy looking at or being around flowers.",
    "Natural sights, such as a landscape or sunset, give you pleasure.",
    "Art generally does not appeal to you.",
    "Reading or hearing poems generally does not appeal to you.",
    "Spending time looking at works in an art museum is not enjoyable for you.",
    "Going to a live music performance is not something you enjoy.",
    "Watching people perform dance is not enjoyable for you.",
  ],
  O3: [
    "When you feel something, the feeling tends to be strong and noticeable.",
    "Other people’s feelings can resonate with you, such as feeling sad when they are sad.",
    "Issues or causes you care about bring out strong feelings in you.",
    "You enjoy looking closely at your feelings, choices, and life experiences.",
    "You make an effort to understand why you think, feel, and act as you do.",
    "Strong feelings do not arise very often for you.",
    "Your feelings usually have little effect on how you respond or act.",
    "You do not often pay attention to how you feel in response to events.",
    "Your feelings usually stay fairly even, without strong peaks or dips.",
    "You find it hard to understand why some people react with strong feelings.",
  ],
  O4: [
    "You would rather have changing experiences than follow the same pattern every day.",
    "You enjoy going somewhere you have not been before.",
    "A wide range of subjects or activities attracts your interest.",
    "Starting an unfamiliar activity or project is enjoyable for you.",
    "You generally choose familiar activities or approaches over unfamiliar ones.",
    "You prefer things to stay as they are rather than change.",
    "Even the thought of changing an established situation feels unappealing.",
    "You tend to repeat familiar routines, such as doing daily tasks the same way.",
    "Foods you have not tried before usually do not appeal to you.",
    "You prefer the usual, established way of doing things.",
  ],
  O5: [
    "You enjoy working out problems that require several steps or careful thought.",
    "You enjoy reading material that takes effort to understand.",
    "You know and use a wide variety of words.",
    "You can take in and work with many pieces of information.",
    "Thinking an idea through is enjoyable to you, even when there is no immediate task to finish.",
    "Ideas without a concrete example, such as theories about fairness, do not interest you much.",
    "You tend to avoid conversations about broad questions such as meaning, truth, or existence.",
    "Ideas that are not about concrete objects or events can be difficult for you to understand.",
    "You are not drawn to conversations about how ideas might work in principle.",
    "You tend not to choose reading that requires a lot of mental effort.",
  ],
  O6: [
    "You tend to support candidates described as politically liberal where you live. The label varies across countries.",
    "You think whether something is right or wrong can depend on the circumstances, rather than one fixed rule.",
    "You favor helping people who commit crimes over focusing on punishing them.",
    "You believe one religion is the true religion, rather than several being equally true.",
    "You tend to support candidates described as politically conservative where you live. The label varies across countries.",
    "You think the government spends more public money supporting artists than it should.",
    "You think laws should be applied firmly rather than allowing much flexibility.",
    "“Coddle” means treat too gently. You think people who commit crimes are treated too leniently.",
    "You favor a firm, strict response to crime.",
    "Standing while your national anthem plays is something you like to do.",
  ],
  A1: [
    "You generally feel you can rely on people rather than expecting them to let you down.",
    "You usually assume people mean well, even before you know them closely.",
    "You generally take people’s statements as truthful.",
    "You believe most people try to do what is right.",
    "You believe there is goodness in people in general.",
    "You tend to expect that things will turn out all right.",
    "You are inclined to doubt whether people can be relied on.",
    "You often wonder whether people want something they are not openly admitting.",
    "You are cautious around people because you are unsure what they might do.",
    "You believe people are fundamentally bad rather than good.",
  ],
  A2: [
    "You would not deliberately give false information to reduce what you owe in taxes.",
    "You usually follow the rules that apply to a situation.",
    "You praise people partly to gain an advantage or favor from them.",
    "You involve people mainly as a way to get what you want for yourself.",
    "You know ways to avoid a rule’s restrictions while still reaching your goal.",
    "You sometimes use dishonest methods to gain an advantage.",
    "You push people to do what you want, even when they may feel uncomfortable.",
    "You sometimes act as if you care about someone when you do not really feel that concern.",
    "You benefit from other people in ways that may be unfair to them.",
    "You sometimes make it harder for someone else to carry out their plans.",
  ],
  A3: [
    "You help people feel included and comfortable when they arrive or join in.",
    "You notice what someone might need before they ask for help.",
    "Helping someone is something you actively enjoy.",
    "What happens to other people and how they are doing matters to you.",
    "You can usually find something kind or positive to say about each person.",
    "You sometimes regard other people as beneath you or less worthy.",
    "Other people’s feelings do not usually matter much to you.",
    "Your behavior sometimes leaves people feeling uneasy around you.",
    "You withdraw support or attention when other people might need you.",
    "You rarely set aside time to pay attention to other people.",
  ],
  A4: [
    "It usually does not take much for you to feel content with an arrangement or outcome.",
    "Direct arguments or tense disagreements are very unpleasant for you.",
    "You strongly dislike coming across as someone who pressures others.",
    "Your words can be cutting or hurtful when you speak to someone.",
    "You often respond by saying that someone else is wrong or by taking the opposing view.",
    "You enjoy getting into a strong argument or dispute.",
    "You sometimes raise your voice at people in anger or frustration.",
    "You sometimes say things intended to offend or belittle someone.",
    "When someone wrongs you, you try to make them experience something unpleasant in return.",
    "You stay resentful about how someone treated you instead of letting it go.",
  ],
  A5: [
    "You do not enjoy being the person everyone is watching or talking about.",
    "You would rather not spend much time telling people about yourself.",
    "You see yourself as an ordinary person rather than someone unusually special.",
    "“Toot my own horn” means advertise your achievements. You rarely do that.",
    "You tend to see yourself as superior to other people.",
    "You have a favorable view of yourself and your abilities.",
    "You generally rate yourself positively as a person.",
    "You feel you have answers to a broad range of questions.",
    "You talk proudly about your good qualities to other people.",
    "You act in ways that bring the group’s attention onto you.",
  ],
  A6: [
    "You feel concern for people who do not have a stable place to live.",
    "You feel compassion for people facing harder circumstances than your own.",
    "You place more value on working together than on beating other people.",
    "When other people are deeply sad, you feel some of that sadness too.",
    "You do not feel much interest in the difficulties other people are facing.",
    "You tend not to like people who are very tender or easily moved by others’ suffering.",
    "You believe a person who causes harm should receive a similar harm in return.",
    "You try to keep people in need out of your thoughts.",
    "You think people should take care of themselves rather than rely on help from others.",
    "You find it difficult to tolerate people you see as lacking strength or resilience.",
  ],
  C1: [
    "You usually manage to finish what you set out to do with a successful result.",
    "You feel you do especially well at the things you do.",
    "You generally deal with tasks without getting stuck or causing unnecessary complications.",
    "You feel confident that you understand the situation and know what you are doing.",
    "When a problem appears, you can usually find a useful way to solve it.",
    "You know the practical steps needed to complete a task.",
    "You sometimes read a situation incorrectly and make a poor judgment about it.",
    "You often feel that you do not understand what is going on or how something works.",
    "You feel you do not have much useful knowledge, effort, or input to offer.",
    "You do not always recognize what may happen as a result of an action.",
  ],
  C2: [
    "You like things to be arranged neatly and in a clear order.",
    "Putting things away and making a space neat is something you like doing.",
    "You want the details of how things are arranged or done to match your standards closely.",
    "You enjoy neat organization and predictable, repeated patterns.",
    "You usually decide on a sequence of steps and then follow it.",
    "After using something, you often forget to return it to its usual spot.",
    "Your room often has things left untidy or scattered around.",
    "You tend to leave your possessions wherever you last used them.",
    "Other people’s untidiness does not usually trouble you.",
    "An untidy or disorganized setting does not usually bother you.",
  ],
  C3: [
    "You make an effort to act within the rules, even when it takes work.",
    "When you say you will do something, you usually follow through.",
    "You normally pay what you owe by the due date.",
    "You generally describe things honestly rather than deliberately giving a false account.",
    "You pay attention to your own sense of what is right and wrong when deciding what to do.",
    "You sometimes act against rules that apply to you.",
    "You sometimes fail to do something you said you would do.",
    "You arrange for other people to handle responsibilities that belong to you.",
    "When someone asks you to do something, you sometimes deliberately do the reverse.",
    "You sometimes describe facts in a misleading way.",
  ],
  C4: [
    "You focus directly on reaching the outcome you want.",
    "You put a lot of effort into the tasks you take on.",
    "You move beyond thinking about a plan and actually begin doing it.",
    "You put your full energy and commitment into a task.",
    "You put in extra effort beyond the minimum that others expect.",
    "You expect yourself and other people to meet demanding standards.",
    "You strongly expect work or products to be done well.",
    "Achieving success is not a strong driving force for you.",
    "You usually do the minimum needed to meet the requirement.",
    "You devote relatively little of your time and energy to your work.",
  ],
  C5: [
    "You handle routine jobs soon after they need doing rather than putting them off.",
    "You usually have what you need ready before a task or situation begins.",
    "Once a task needs doing, you begin without much delay.",
    "When it is time to work, you start rather than lingering over other things.",
    "You follow through on the actions you planned to take.",
    "Getting yourself to begin working often feels difficult.",
    "You spend time on things you later feel were not a worthwhile use of it.",
    "You often need encouragement or pressure from someone else before beginning.",
    "The first step of a task is often hard for you to get yourself to do.",
    "You put off making choices until a later time.",
  ],
  C6: [
    "You take care to prevent errors rather than accepting them casually.",
    "You think about what you are going to say before saying it.",
    "Once you choose a course of action, you tend to stay with it.",
    "You begin doing something before considering what might happen.",
    "You sometimes choose quickly without giving the decision enough thought.",
    "You enjoy doing something because of a sudden desire rather than a prior plan.",
    "You move into an action quickly instead of taking time to consider it.",
    "You sometimes do things that seem wild or poorly thought through.",
    "You sometimes act first and consider the consequences afterward.",
    "You often decide what to do shortly before doing it instead of planning well ahead.",
  ],
};

const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
export const questionExplanations: Record<string, string> = {};
for (const facet of bank["300"]) {
  if (questionNotes[facet.id]?.length !== facet.items.length)
    throw new Error(`Missing explanations for ${facet.id}`);
  facet.items.forEach((item, index) => {
    questionExplanations[normalize(item.text)] = questionNotes[facet.id][index];
  });
}
questionExplanations["Believe that there is no absolute right and wrong."] =
  questionExplanations["Believe that there is no absolute right or wrong."];
export function explainQuestion(text: string) {
  return questionExplanations[normalize(text)];
}

export type Explanation = {
  meaning: string;
  lower: string;
  higher: string;
  reflection: string;
  note?: string;
};
export const traitExplanations: Record<string, Explanation> = {
  O: {
    meaning:
      "This is about how much you enjoy exploring ideas, feelings, art, and unfamiliar experiences. It brings together several kinds of curiosity, so you might enjoy new ideas while still preferring familiar daily routines.",
    lower:
      "You may prefer practical examples, familiar surroundings, and methods you already know. For example, you might return to a favorite activity instead of trying a new one.",
    higher:
      "You may enjoy imagining possibilities, exploring art, or trying a different approach. For example, an unfamiliar subject might make you want to read more about it.",
    reflection:
      "Where do you enjoy something new, and where do familiar routines help you? Look at the six facets to see whether those preferences differ.",
    note: "Openness is not a measure of intelligence, education, or how interesting you are.",
  },
  C: {
    meaning:
      "This is about your usual approach to tasks, plans, and responsibilities. It combines being organized, working toward goals, following through, and thinking before acting.",
    lower:
      "You may keep plans flexible, work in bursts, or find it harder to begin routine tasks. For example, you might decide how to spend the day as it unfolds.",
    higher:
      "You may like clear plans, preparation, and finishing what you start. For example, you might break a deadline into steps and complete them in order.",
    reflection:
      "Which responsibilities are easy to follow through on, and which ones need reminders, clearer steps, or outside support?",
    note: "A score does not measure your worth or how much effort a particular task costs you. Circumstances and available support matter.",
  },
  E: {
    meaning:
      "This is about how strongly you tend to seek company, activity, excitement, and outward expression. Social warmth and wanting a busy social life are separate facets; they do not have to match.",
    lower:
      "You may prefer smaller gatherings, a slower pace, or more time alone. For example, you might enjoy a conversation with one friend more than a crowded party.",
    higher:
      "You may enjoy frequent interaction, speaking up, and lively activities. For example, you might introduce yourself to new people or organize a group outing.",
    reflection:
      "Which kinds of company and activity leave you feeling engaged, and which feel like too much?",
    note: "Lower extraversion does not automatically mean shyness, loneliness, or poor social skills.",
  },
  A: {
    meaning:
      "This is about how you approach other people’s needs and intentions. It includes trust, helping, handling disagreements, and how readily you feel compassion.",
    lower:
      "You may question people’s motives, protect your own interests, or be willing to argue. For example, you might challenge an agreement that does not seem fair to you.",
    higher:
      "You may give people the benefit of the doubt, offer help, or seek compromise. For example, you might adjust a shared plan so that everyone can take part.",
    reflection:
      "When does cooperation work well for you, and when is it useful to state a boundary or disagree?",
    note: "This is not a verdict about whether you are a good or bad person. Consider the individual facets and the situation.",
  },
  N: {
    meaning:
      "This is about how readily you experience worry, frustration, sadness, or feeling overwhelmed. The six facets separate different kinds of difficult feelings rather than treating them all as the same.",
    lower:
      "You may describe yourself as less easily unsettled or more able to stay calm under pressure. For example, a change of plans may not stay on your mind for long.",
    higher:
      "You may notice stress and difficult feelings more readily. For example, an uncertain outcome may take up a lot of your attention even before anything has happened.",
    reflection:
      "Which situations bring out these feelings, and what helps you feel supported or regain your footing?",
    note: "Neither this trait nor a facet called “Depression” or “Anxiety” can diagnose a condition. The questions describe self-reported tendencies.",
  },
};

export const facetExplanations: Record<string, Explanation> = {
  N1: {
    meaning:
      "Anxiety here means a tendency to worry or anticipate danger and problems.",
    lower: "You may approach uncertain situations with less worry.",
    higher:
      "You may often think about what could go wrong, such as before an important conversation.",
    reflection: "Does uncertainty bother you more than the actual task?",
  },
  N2: {
    meaning:
      "Anger describes how readily frustration turns into irritation or anger.",
    lower: "Delays and small annoyances may be easier to take in stride.",
    higher:
      "Interruptions, unfairness, or obstacles may quickly make you feel angry.",
    reflection: "Which kinds of frustration are hardest for you to let go of?",
  },
  N3: {
    meaning:
      "Depression is the inventory’s name for a tendency toward low spirits and negative feelings about yourself.",
    lower: "You may report fewer low moods and more comfort with yourself.",
    higher: "You may report more sadness, discouragement, or self-criticism.",
    reflection:
      "Do these answers reflect your usual experience or a particularly difficult recent period?",
    note: "This facet is not a depression screening or diagnosis.",
  },
  N4: {
    meaning:
      "Self-consciousness means feeling uneasy about being noticed, judged, or embarrassed.",
    lower:
      "You may feel fairly comfortable being visible or meeting unfamiliar people.",
    higher:
      "You may worry about how you come across, such as when speaking in a group.",
    reflection:
      "Are you more comfortable with familiar people than with a new group?",
  },
  N5: {
    meaning:
      "Immoderation means finding it hard to resist an urge or stop at the amount you intended.",
    lower: "You may find it easier to stop or turn down a temptation.",
    higher:
      "An immediate desire may sometimes outweigh your earlier intention to limit it.",
    reflection:
      "When is it easy to stop, and when does the situation make that harder?",
    note: "This score does not establish an addiction or an eating disorder.",
  },
  N6: {
    meaning:
      "Vulnerability here means feeling overwhelmed or less able to cope when under stress.",
    lower:
      "You may feel able to stay composed and work out what to do under pressure.",
    higher:
      "When several demands arrive together, it may be hard to think clearly or choose a next step.",
    reflection:
      "Does a small next step or help from someone else change how manageable a demand feels?",
  },
  E1: {
    meaning:
      "Friendliness describes how readily you show warmth and develop personal connections.",
    lower: "You may take time to open up and let people get close.",
    higher:
      "You may quickly feel at ease with new people and show interest in them.",
    reflection:
      "How long does it usually take you to feel comfortable with someone new?",
  },
  E2: {
    meaning:
      "Gregariousness simply means enjoying company, especially groups and gatherings.",
    lower: "You may prefer solitude or a small amount of company.",
    higher:
      "You may enjoy being among many people, such as at a busy celebration.",
    reflection:
      "How much company feels enjoyable before you want some time alone?",
  },
  E3: {
    meaning:
      "Assertiveness describes your tendency to speak up, influence decisions, or take the lead.",
    lower:
      "You may prefer to let others direct a group or keep your views private.",
    higher:
      "You may readily state your view or take responsibility for organizing a group.",
    reflection:
      "Do you speak up differently with friends, at work, or with unfamiliar people?",
    note: "This is about a tendency to take the floor, not proof of leadership skill.",
  },
  E4: {
    meaning:
      "Activity level describes how busy, energetic, and fast-paced you tend to be.",
    lower:
      "You may enjoy an unhurried pace with room to rest between activities.",
    higher:
      "You may prefer a full schedule and moving quickly between activities.",
    reflection: "What pace lets you do what matters without feeling rushed?",
  },
  E5: {
    meaning:
      "Excitement-seeking describes your appetite for stimulation, thrills, and risk.",
    lower: "You may prefer quieter, more predictable experiences.",
    higher: "You may find loud, adventurous, or risky experiences appealing.",
    reflection:
      "Which kinds of excitement do you enjoy, and which do not appeal to you?",
    note: "Enjoying novelty in ideas is different from enjoying physical risk or loud settings.",
  },
  E6: {
    meaning:
      "Cheerfulness describes how readily you experience and express joy, amusement, and enthusiasm.",
    lower:
      "Your usual manner may be more reserved or serious, with fewer outward displays of joy.",
    higher:
      "You may laugh easily, show excitement, or often find things enjoyable.",
    reflection: "What kinds of moments bring out your sense of fun?",
    note: "A lower score does not by itself mean that you are unhappy.",
  },
  O1: {
    meaning:
      "Imagination describes enjoyment of fantasy, daydreaming, and an active inner world.",
    lower:
      "You may spend more attention on what is happening around you than on imagined possibilities.",
    higher:
      "You may enjoy inventing scenes, picturing alternatives, or getting absorbed in thought.",
    reflection:
      "Does imagining possibilities play a part in your hobbies or everyday decisions?",
  },
  O2: {
    meaning:
      "Artistic interests describe how much beauty, art, music, and nature appeal to you.",
    lower: "Artistic experiences may be less central to what you enjoy.",
    higher:
      "You may be strongly drawn to a piece of music, a painting, or a natural scene.",
    reflection:
      "Which forms of beauty catch your attention, even if other art forms do not?",
    note: "This measures reported interest, not artistic talent or training.",
  },
  O3: {
    meaning:
      "Emotionality here means awareness of, interest in, and intensity of feelings.",
    lower:
      "Feelings may be less prominent in your attention or feel less intense.",
    higher:
      "You may notice feelings clearly and enjoy understanding what they mean.",
    reflection:
      "Do you notice a feeling as it happens, or only when you look back?",
    note: "This facet concerns feelings in general; it is different from the stress-focused Neuroticism trait.",
  },
  O4: {
    meaning:
      "Adventurousness here means preferring variety and being open to unfamiliar activities.",
    lower:
      "You may enjoy reliable routines, favorite places, and familiar choices.",
    higher:
      "You may like trying a new place, food, hobby, or way of doing a task.",
    reflection:
      "Which routines do you value, and where do you welcome variety?",
    note: "This does not necessarily mean seeking danger or extreme sports.",
  },
  O5: {
    meaning:
      "Intellect is the inventory’s name for interest in thinking through ideas and complex questions.",
    lower:
      "You may prefer concrete tasks and straightforward information over abstract discussion.",
    higher:
      "You may enjoy difficult reading, puzzles, or exploring a theory in depth.",
    reflection: "Which subjects make you want to think more deeply?",
    note: "This is not an IQ test and does not measure your intelligence.",
  },
  O6: {
    meaning:
      "Liberalism is the original facet name for attitudes toward tradition, authority, and established rules.",
    lower:
      "Your answers may favor established beliefs, strict rules, or traditional practices.",
    higher:
      "Your answers may be more willing to question established beliefs or accept flexible viewpoints.",
    reflection:
      "Do your views differ across religion, public rules, and everyday customs?",
    note: "Some original questions use political and religious wording that depends on culture. This score should not be used to assign you a political party or identity.",
  },
  A1: {
    meaning:
      "Trust describes the expectations you bring to other people’s intentions and honesty.",
    lower:
      "You may want evidence before relying on someone or accepting what they say.",
    higher:
      "You may start by assuming people mean well and are telling the truth.",
    reflection:
      "What experiences lead you to extend trust or become more cautious?",
  },
  A2: {
    meaning:
      "Morality is the original facet label for straightforwardness versus using deception or manipulation for advantage.",
    lower:
      "Your answers may show more willingness to use pressure, flattery, or workarounds to get what you want.",
    higher:
      "Your answers may show a preference for being direct and avoiding unfair advantage.",
    reflection:
      "When your interests conflict with someone else’s, how do you handle it?",
    note: "The label is narrow and dated. This score is not an overall judgment of your ethics or character.",
  },
  A3: {
    meaning:
      "Altruism describes how readily you offer help and pay attention to others’ needs.",
    lower:
      "You may be less inclined to offer your time or get involved in someone else’s needs.",
    higher:
      "You may enjoy helping and notice useful things you can do before being asked.",
    reflection:
      "Which kinds of helping feel natural to you, and which stretch your capacity?",
  },
  A4: {
    meaning:
      "Cooperation describes how you tend to respond to disagreement and conflict.",
    lower: "You may be more ready to confront, argue, or continue a dispute.",
    higher: "You may prefer compromise and avoiding a hostile exchange.",
    reflection:
      "Can you keep a disagreement respectful while still saying what you need?",
    note: "Cooperation does not have to mean agreeing with everything.",
  },
  A5: {
    meaning:
      "Modesty describes how much you avoid claiming superiority or drawing attention to your own qualities.",
    lower:
      "You may be more comfortable emphasizing your strengths or standing out.",
    higher:
      "You may prefer to downplay achievements and avoid being the center of attention.",
    reflection:
      "How comfortable are you acknowledging a strength without comparing yourself with others?",
    note: "This is not a direct measure of confidence or self-esteem.",
  },
  A6: {
    meaning:
      "Sympathy describes how readily you feel compassion for people facing difficulties.",
    lower:
      "You may place more emphasis on self-reliance or stay emotionally detached from others’ problems.",
    higher:
      "You may be readily moved by suffering and concerned about people in need.",
    reflection:
      "What kinds of situations most readily bring out your concern for someone else?",
  },
  C1: {
    meaning:
      "Self-efficacy means your sense that you can handle tasks and get useful results.",
    lower:
      "You may doubt your ability to work something out or contribute effectively.",
    higher:
      "You may feel confident about finding solutions and completing tasks.",
    reflection:
      "Which tasks feel manageable because you have experience or support?",
    note: "This measures how you describe your capability, not an independent test of your skills.",
  },
  C2: {
    meaning:
      "Orderliness describes your preference for neatness, organization, and predictable arrangements.",
    lower: "You may tolerate clutter or work without a detailed system.",
    higher: "You may like clear places for things and an organized plan.",
    reflection:
      "Where does organization help you, and where does flexibility work better?",
  },
  C3: {
    meaning:
      "Dutifulness describes how strongly you tend to honor commitments and follow obligations.",
    lower: "You may be more willing to set aside rules or commitments.",
    higher:
      "You may feel strongly about keeping promises and doing what you agreed to do.",
    reflection:
      "How do you decide which commitments you can realistically keep?",
    note: "Consider opportunity and circumstances as well as intention when reflecting on your answers.",
  },
  C4: {
    meaning:
      "Achievement-striving means the effort and ambition you put into reaching goals and meeting standards.",
    lower:
      "You may place less emphasis on pushing for achievement or doing more than required.",
    higher:
      "You may set demanding goals and put substantial effort into reaching them.",
    reflection:
      "Which goals matter enough to you to justify the effort they take?",
    note: "A higher score does not guarantee success, and a lower one does not mean you lack meaningful priorities.",
  },
  C5: {
    meaning:
      "Self-discipline describes getting started and following through, including when a task is routine or unappealing.",
    lower:
      "You may delay starting or need reminders and encouragement to continue.",
    higher: "You may begin promptly and stay with a plan until it is done.",
    reflection: "Does making the first step smaller help you begin a task?",
    note: "The score does not explain why starting is easy or hard for you.",
  },
  C6: {
    meaning:
      "Cautiousness describes how much you consider an action before taking it.",
    lower: "You may act spontaneously and work out the details afterward.",
    higher:
      "You may pause to consider consequences and choose your words or next step carefully.",
    reflection:
      "Which decisions benefit from a pause, and which are easy to adjust later?",
    note: "Taking more time is not automatically better; the demands of the situation matter.",
  },
};
