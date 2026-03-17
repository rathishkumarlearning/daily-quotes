import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, '../public/audio');
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

// Use OpenClaw's bundled node-edge-tts
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { EdgeTTS } = require('/opt/homebrew/lib/node_modules/openclaw/node_modules/node-edge-tts/dist/edge-tts.js');

const VOICE = 'en-US-MichelleNeural'; // Same as OpenClaw TTS
const RATE = '+0%';
const PITCH = '+0Hz';

const quotes = [
  { slug: 'jobs-connecting-dots', text: "You can't connect the dots looking forward; you can only connect them looking backwards. So you have to trust that the dots will somehow connect in your future. — Steve Jobs" },
  { slug: 'dijkstra-simplicity', text: "Simplicity is a great virtue but it requires hard work to achieve it and education to appreciate it. And to make matters worse: complexity sells better. — Edsger Dijkstra" },
  { slug: 'feynman-teaching', text: "If you can't explain it simply, you don't understand it well enough. — Richard Feynman" },
  { slug: 'bezos-day-one', text: "It's always Day 1. Day 2 is stasis. Followed by irrelevance. Followed by excruciating, painful decline. Followed by death. And that is why it is always Day 1. — Jeff Bezos" },
  { slug: 'hamming-important-problems', text: "If you do not work on an important problem, it's unlikely you'll do important work. — Richard Hamming" },
  { slug: 'jocko-discipline-freedom', text: "Discipline equals freedom. — Jocko Willink" },
  { slug: 'seneca-time', text: "It is not that we have a short time to live, but that we waste a lot of it. — Seneca" },
  { slug: 'altman-iterate', text: "Move fast. Speed is one of your main advantages over large companies. — Sam Altman" },
  { slug: 'knuth-premature-optimization', text: "Premature optimization is the root of all evil. — Donald Knuth" },
  { slug: 'munger-mental-models', text: "You've got to have models in your head. And you've got to array your experience both vicarious and direct on this latticework of models. — Charlie Munger" },
  { slug: 'voltaire-perfect-enemy', text: "Perfect is the enemy of good. — Voltaire" },
  { slug: 'iam-least-privilege', text: "Every program and every privileged user of the system should operate using the least amount of privilege necessary to complete the job. — Jerome Saltzer" },
  { slug: 'naval-luck', text: "You make your own luck by being the kind of person that luck happens to. — Naval Ravikant" },
  { slug: 'brooks-adding-people', text: "Adding manpower to a late software project makes it later. — Fred Brooks" },
  { slug: 'aurelius-present', text: "You have power over your mind, not outside events. Realize this, and you will find strength. — Marcus Aurelius" },
  { slug: 'tesla-future', text: "The present is theirs; the future, for which I really worked, is mine. — Nikola Tesla" },
  { slug: 'linus-talking', text: "Talk is cheap. Show me the code. — Linus Torvalds" },
  { slug: 'principal-engineer', text: "A principal engineer is an engineer who can make other engineers around them more effective. — Will Larson" },
  { slug: 'zero-trust', text: "Never trust, always verify. — John Kindervag" },
  { slug: 'picasso-good-artists', text: "Good artists copy; great artists steal. — Pablo Picasso" },
  { slug: 'gates-lazy-engineer', text: "I choose a lazy person to do a hard job. Because a lazy person will find an easy way to do it. — Bill Gates" },
  { slug: 'einstein-imagination', text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world. — Albert Einstein" },
  { slug: 'wozniak-build-alone', text: "Most inventors and engineers I've met are like me, they're shy and they live in their heads. They're almost like artists. And artists work best alone. — Steve Wozniak" },
  { slug: 'covey-sharpen-saw', text: "Give me six hours to chop down a tree and I will spend the first four sharpening the axe. — Abraham Lincoln" },
  { slug: 'zuckerberg-done-perfect', text: "Done is better than perfect. — Mark Zuckerberg" },
  { slug: 'rich-dad-assets', text: "The rich buy assets. The poor only have expenses. The middle class buys liabilities they think are assets. — Robert Kiyosaki" },
  { slug: 'obama-change', text: "Change will not come if we wait for some other person or some other time. We are the ones we've been waiting for. — Barack Obama" },
  { slug: 'newton-standing-giants', text: "If I have seen further, it is by standing on the shoulders of giants. — Isaac Newton" },
  { slug: 'cook-intuition', text: "Intuition is very powerful, and I think more powerful than intellect. — Steve Jobs" },
  { slug: 'kay-predict-future', text: "The best way to predict the future is to invent it. — Alan Kay" },
  { slug: 'andreessen-software-eating', text: "Software is eating the world. — Marc Andreessen" },
  { slug: 'bezos-regret-minimization', text: "I knew that when I was 80, I was not going to regret having tried this. I was not going to regret trying to participate in this thing called the internet. — Jeff Bezos" },
  { slug: 'dorsey-simplicity-product', text: "Make every detail perfect and limit the number of details to perfect. — Jack Dorsey" },
  { slug: 'epictetus-control', text: "Make the best use of what is in your power, and take the rest as it happens. — Epictetus" },
  { slug: 'musk-physics-first-principles', text: "I think it's important to reason from first principles rather than by analogy. — Elon Musk" },
  { slug: 'ive-design-invisible', text: "When something exceeds your ability to understand how it works, it sort of becomes magical. — Jony Ive" },
  { slug: 'carnegie-others-interests', text: "You can make more friends in two months by becoming genuinely interested in other people than you can in two years by trying to get other people interested in you. — Dale Carnegie" },
  { slug: 'scott-effort-talent', text: "Hard work beats talent when talent doesn't work hard. — Tim Notke" },
  { slug: 'lovelace-imagination', text: "The Analytical Engine has no power of originating anything. It can only do what we know how to order it to perform. — Ada Lovelace" },
  { slug: 'thoreau-deliberate', text: "I went to the woods because I wished to live deliberately, to front only the essential facts of life. — Henry David Thoreau" },
  { slug: 'wright-brothers-fly', text: "It is possible to fly without motors, but not without knowledge and skill. — Wilbur Wright" },
  { slug: 'gandhi-be-change', text: "Be the change you wish to see in the world. — Mahatma Gandhi" },
  { slug: 'tiger-mom-grit', text: "Grit is passion and perseverance for very long-term goals. — Angela Duckworth" },
  { slug: 'buffett-circle-competence', text: "The most important thing in terms of your circle of competence is not how large the area of it is, but how well you've defined the perimeter. — Warren Buffett" },
  { slug: 'hopper-ship-program', text: "The most dangerous phrase in the language is: we've always done it this way. — Grace Hopper" },
  { slug: 'jacobi-invert', text: "Invert, always invert. — Carl Jacobi" },
  { slug: 'feynman-doubt', text: "I would rather have questions that can't be answered than answers that can't be questioned. — Richard Feynman" },
  { slug: 'hemingway-first-draft', text: "The first draft of anything is rough. Rewrite it until it's worthy. — Ernest Hemingway" },
  { slug: 'armstrong-prepare', text: "It's a small step for a man, one giant leap for mankind. — Neil Armstrong" },
  { slug: 'shannon-information', text: "Information is the resolution of uncertainty. — Claude Shannon" },
  { slug: 'thiel-competition', text: "Competition is for losers. — Peter Thiel" },
  { slug: 'confucius-choose-love', text: "Choose a job you love, and you will never have to work a day in your life. — Confucius" },
  { slug: 'paul-graham-write', text: "Write like you talk. Actually talk, then write it down. — Paul Graham" },
  { slug: 'deming-system', text: "A bad system will beat a good person every time. — W. Edwards Deming" },
  { slug: 'kelvin-measure', text: "If you can't measure it, you can't improve it. — Lord Kelvin" },
  { slug: 'godin-permission', text: "You don't need more time, you just need to decide. — Seth Godin" },
  { slug: 'kant-reason', text: "Dare to know! Have the courage to use your own understanding. — Immanuel Kant" },
  { slug: 'curie-fear-nothing', text: "Nothing in life is to be feared, it is only to be understood. — Marie Curie" },
  { slug: 'turing-machine', text: "We can only see a short distance ahead, but we can see plenty there that needs to be done. — Alan Turing" },
  { slug: 'voltaire-work-boredom', text: "Work saves us from three great evils: boredom, vice, and need. — Voltaire" },
  { slug: 'darwin-survive', text: "It is not the strongest of the species that survives, nor the most intelligent; it is the one most adaptable to change. — Charles Darwin" },
  { slug: 'franklin-investment-knowledge', text: "An investment in knowledge pays the best interest. — Benjamin Franklin" },
  { slug: 'postman-medium-message', text: "The medium is the message. — Marshall McLuhan" },
  { slug: 'sun-tzu-strategy', text: "Strategy without tactics is the slowest route to victory. Tactics without strategy is the noise before defeat. — Sun Tzu" },
  { slug: 'hawking-intelligence', text: "Intelligence is the ability to adapt to change. — Stephen Hawking" },
  { slug: 'miyamoto-games', text: "A delayed game is eventually good, but a rushed game is forever bad. — Shigeru Miyamoto" },
  { slug: 'welsh-differentiate', text: "Before you are a leader, success is all about growing yourself. When you become a leader, success is all about growing others. — Jack Welch" },
  { slug: 'ford-faster-horse', text: "If I had asked people what they wanted, they would have said faster horses. — Henry Ford" },
  { slug: 'chesterton-fence', text: "Don't ever take a fence down until you know the reason it was put up. — G.K. Chesterton" },
  { slug: 'mandela-impossible-done', text: "It always seems impossible until it's done. — Nelson Mandela" },
];

console.log(`🎙️ Generating ${quotes.length} audio files with Edge TTS (${VOICE})\n`);

let success = 0;
let failed = 0;

for (const q of quotes) {
  const outPath = join(outputDir, `${q.slug}.mp3`);
  try {
    const tts = new EdgeTTS();
    await tts.ttsPromise(q.text, outPath, VOICE, RATE, PITCH);
    console.log(`  ✅ ${q.slug}`);
    success++;
  } catch (e) {
    console.log(`  ❌ ${q.slug}: ${e.message?.slice(0, 60)}`);
    failed++;
  }
}

console.log(`\n✅ ${success} done, ❌ ${failed} failed`);
