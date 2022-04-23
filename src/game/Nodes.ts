import { CloudStorage } from "../storage/CloudStorageProvider";

export type TextOptions = Partial<{ [key in NodeId]: string | string[] }>;
export type ShipStatus =
  | "warning"
  | "critical"
  | "warp-warning"
  | "warp-critical";

export interface TextNode {
  prompt: string | string[];
  options: TextOptions | NodeId;
  travelInfo?: {
    failure: NodeId;
    success: NodeId;
  };
  showSpaceship?: boolean;
  mission?: string;
  geiger?: 1 | 2 | 3;
  status?: ShipStatus;
  engineOn?: boolean;
  increaseAirlockTime?: boolean;
}

export enum GameNode {
  START_1,
  LEFT_1,
  RIGHT_1,
  SUFFOCATE_1,
  ENTER_SHIP_1,
  THANKS_1,
  WHO_SPEAKING,
  NOT_SURE,
  COORDINATES_1,
  FIRST_WARP,
  AFTER_FIRST_WARP,
  FOLLOW_RADIATION_TRAIL,
  KEEP_FOLLOWING,
  KEEP_FOLLOWING_2,
  GO_BACK_RADIATION,
  KEEP_LEAVING_TRAIL,
  DOCK_WITH_SHIP,
  CHECK_SENSORS,
  EXIT_AIRLOCK,
  SHINE_LIGHT,
  STAY_ON_SHIP,
  EXIT_AIRLOCK_NO_SNEAKY,
  FOLLOW_PATH,
  STAY_IN_FRONT_OF_DOOR,
  HIDE_NEXT_TO_DOOR,
  MEET_ANDROID,
  SNEAK_THROUGH_DOOR,
  INVESTIGATE_DOOR,
  BACK_TO_BIG_ROOM,
  SNEAK_HIBERNATION_ROOM,
  GREET_PIP,
  PIP_DEAD,
  CHASE_DEAD,
  FOLLOW_PIP,
  WHY_TRUST_GRAVLAX,
  CRASH_0,
  CRASH_1,
  STARVE_TO_DEATH,
  FINED_BY_SPACE_CATS,
}

export type NodeId = keyof typeof GameNode;

export type TextNodeGraph = Record<NodeId, TextNode>;

export const gameGraph = (context: CloudStorage): TextNodeGraph => {
  return {
    FINED_BY_SPACE_CATS: {
      prompt: `A furry figure silently appears behind you. It is a cat in a space suit with a laser gun, holding a
       demand notice for a 10,000 credit fine in its paw. You immediately draw your weapon, but the cat reacts with 
       cat-like reflexes and shoots you first. As your consciousness fades, your last thought is that this isn't how you
       thought today would go.`,
      options: {
        START_1: "Retry?",
      },
      status: "critical",
    },
    START_1: {
      prompt: [
        `You are in a small room, and the door behind you shuts with a hiss.`,
        `The only thing with you is the letter you just picked up, as you keep your few possessions aboard your ship.`,
        `You turn, and in front of you is a narrow tube, just large enough for you to fit through. A door opens at the 
        end with a faint rattling sound.`,
      ],
      options: {
        LEFT_1: `Look left.`,
        RIGHT_1: `Look right.`,
        ENTER_SHIP_1: `Enter ship.`,
      },
      mission: `Find Chase in coordinates 1D`,
    },
    LEFT_1: {
      prompt: [
        `You look left. You see the inside of a spaceport airlock. Nothing is out of place.`,
        `The airlock wall is made of glass, and behind it you can see the network of tubes making up your local space 
        garage center. Behind it, a pale red sun is rising over the moon base. You think it will be a few more hours 
        before the primary sun starts to rise.${
          context.airlockTime > 2
            ? ` If you spend too long admiring the view, you might run our of air in the airlock.`
            : ""
        }`,
      ],
      increaseAirlockTime: true,
      options:
        context.airlockTime > 4
          ? {
              SUFFOCATE_1: `Look right.`,
              ENTER_SHIP_1: `Enter ship.`,
            }
          : {
              RIGHT_1: `Look right.`,
              ENTER_SHIP_1: `Enter ship.`,
            },
    },
    RIGHT_1: {
      prompt: `You look to the right. You see the door you just came out of.${
        context.airlockTime > 2
          ? ` Now that it's shut, you only have about a 
      minute more until the airlock runs out of air.`
          : ""
      }`,
      increaseAirlockTime: true,
      options:
        context.airlockTime > 4
          ? {
              SUFFOCATE_1: `Look left.`,
              ENTER_SHIP_1: `Enter ship.`,
            }
          : {
              LEFT_1: `Look left.`,
              ENTER_SHIP_1: `Enter ship.`,
            },
    },
    SUFFOCATE_1: {
      prompt: `You gasp involuntarily as you feel each breath getting shallower. You have waited too long in the 
      airlock; the low pressure chamber was already an oxygen-poor environment to begin with, and your respirations have 
      increased the CO2 to dangerous levels. Your bio-engineered reptilian body needs a high level of oxygen to 
      function, and without it, your vision starts to darken at the edges. Then your body begins to convulse. As you 
      black out, your last thought is to wonder why you didn't just enter your ship.`,
      options: {
        START_1: "Retry?",
      },
      status: "critical",
    },
    ENTER_SHIP_1: {
      prompt: [
        `You enter the ship and sit down on the familiar leather pilot seat.`,
        `You hear a voice; it sounds nearly organic but for a faint metallic something in it's timber.`,
        `"Welcome to your space ship, ` +
          process.env.REACT_APP_CHARACTER_NAME +
          `"`,
      ],
      options: {
        THANKS_1: `"Thank you"`,
        WHO_SPEAKING: `"Who is speaking?"`,
        COORDINATES_1: `"I'll need you to set a course for a wormhole jump."`,
      },
      showSpaceship: true,
    },
    THANKS_1: {
      prompt:
        `Shipsley: "Well, of course! Who wants a space ship that doesn't even welcome you aboard! Now, where are we ` +
        `off to today?"`,
      options: {
        NOT_SURE: `"I'm not sure..."`,
        COORDINATES_1: `"I have the coordinates right here."`,
      },
      showSpaceship: true,
    },
    WHO_SPEAKING: {
      prompt: `Shipsley: "Silly Sfinx! It's me, Shipsley, the voice of your beloved ship, of course!! Now, where are we off to today?"`,
      options: {
        NOT_SURE: `"I'm not sure..."`,
        COORDINATES_1: `"I have the coordinates right here."`,
      },
      showSpaceship: true,
    },
    NOT_SURE: {
      prompt: `Shipsley: "Well, it's certainly a big galaxy out there! Let me know when you know where you want to go."`,
      options: {
        COORDINATES_1: `"Ok, I'm ready now!"`,
      },
      showSpaceship: true,
    },
    COORDINATES_1: {
      prompt: `Shipsley: "Enter the wormhole coordinates of your destination, and then we will be on our way!"`,
      options: {},
      travelInfo: {
        failure: `CRASH_0`,
        success: `FIRST_WARP`,
      },
      showSpaceship: true,
    },
    FIRST_WARP: {
      prompt: `Shipsley: "Wormhole coordinate jump complete!"`,
      options: {
        AFTER_FIRST_WARP: `"Thanks, Shipsley!"`,
      },
      showSpaceship: true,
    },
    CRASH_0: {
      prompt: `The hum of your wormcoor drive increases to a whine, and then a shriek, before it is violently cut off. Your
        ship was never built to withstand the wormhole differential pressure it is now experiencing. You can see the
        walls of your ship bulging inwards - or is that just the warping of spacetime itself? You can feel the blood 
        vessels in your eyes popping, and your head pounding.`,
      options: "CRASH_1",
      showSpaceship: true,
      status: "warp-warning",
    },
    CRASH_1: {
      prompt: `Finally you begin to black out, knowing there is no way you will come out of this alive. The last thing
      you hear is the voice of your ship, repeating your name...`,
      options: {
        COORDINATES_1: `Retry?`,
      },
      showSpaceship: true,
      status: "warp-critical",
    },
    AFTER_FIRST_WARP: {
      prompt: `You don't see anything at all. But your geiger counter starts to beep...`,
      options: {
        FOLLOW_RADIATION_TRAIL: `Go toward the radiation`,
        GO_BACK_RADIATION: `Go away from the radiation`,
      },
      showSpaceship: true,
      geiger: 1,
    },
    GO_BACK_RADIATION: {
      prompt: `There's really not much out here. You start imagining how easy it would be to get stranded out here.`,
      options: {
        KEEP_LEAVING_TRAIL: `Keep going in this direction`,
        FOLLOW_RADIATION_TRAIL: `Turn back around`,
      },
      showSpaceship: true,
      engineOn: true,
    },
    KEEP_LEAVING_TRAIL: {
      prompt:
        `You still don't see anything out here at all. After a few days, you lose the radiation trail. After a few ` +
        `months, you begin to wonder why you are out here at all. Your food and fuel stores start to run low. You ` +
        `ration them as best you can, but without any place to resupply, the outlook is grim.`,
      options: {
        STARVE_TO_DEATH: [
          `Keep searching for civilization`,
          `Give up and try to conserve your energy`,
        ],
      },
      showSpaceship: true,
      engineOn: true,
    },
    STARVE_TO_DEATH: {
      prompt:
        `It's been nearly a year since you left on this mission. You are weak, but you manage to tell the ship ` +
        `to send out a final distress call. No one answers. One day, you finally starve to death in your ship.`,
      options: {
        AFTER_FIRST_WARP: `Try again?`,
      },
      showSpaceship: true,
      status: "critical",
    },
    FOLLOW_RADIATION_TRAIL: {
      prompt:
        `You turn on your thrusters and start accelerating toward the radiation trail. The beeps from your geiger ` +
        `counter become more frequent - you must be getting closer to the source of the radiation.`,
      options: {
        GO_BACK_RADIATION: `Go away from the radiation`,
        KEEP_FOLLOWING: `Keep following the radiation trail`,
      },
      geiger: 2,
      showSpaceship: true,
      engineOn: true,
    },
    KEEP_FOLLOWING: {
      prompt:
        `A dark shape appears in the distance, which resolves into a huge ship as you get closer. It looks ` +
        `strangely dark.`,
      options: {
        KEEP_FOLLOWING_2: `Approach the ship`,
        GO_BACK_RADIATION: `Fly away from the ship`,
      },
      showSpaceship: true,
      geiger: 2,
      engineOn: true,
    },
    KEEP_FOLLOWING_2: {
      prompt:
        `As you get closer, you can make out a seal painted neatly on the side. This must be a royal ship - or ` +
        `maybe space pirates pretending to be one. Either way, they must be well-funded to be flying something this ` +
        `large. Or at least, at some point they were flying it. Now, the ship drifts aimlessly, and you can't ` +
        `even see the usual glow of a pilot flare behind their thrusters.`,
      options: {
        GO_BACK_RADIATION: `Reverse thrusters and make a hasty escape.`,
        DOCK_WITH_SHIP: `Dock with the ship.`,
      },
      showSpaceship: true,
      geiger: 3,
      engineOn: true,
    },
    DOCK_WITH_SHIP: {
      prompt: [
        `Now that you've found the ship, you mute your geiger counter. You approach the ship slowly, and dock with ` +
          `their docking port. Luckily, you have a radiation suit, which you put on. The airlock hisses and slides open.`,
        `You peer out the hatch, but all you see is darkness. You smell something rotten - like a decaying animal.`,
      ],
      options: {
        EXIT_AIRLOCK: `Step out of the airlock as quietly as possible.`,
        SHINE_LIGHT: `Use your space light to see what is outside of the hatch.`,
        CHECK_SENSORS: `Send out a bio-pulse to check sensors for signs of life.`,
      },
      showSpaceship: true,
    },
    EXIT_AIRLOCK: {
      prompt: [
        `Now that you've docked, you can tell the ship's artificial gravity is disabled, so you activate the magnets ` +
          `in your boots.`,
        `Trying not to make any sound, you step gingerly out of the airlock.`,
        `The floor panel beneath your foot begins to glow with a dim blue light.`,
        `After a moment, additional panels begin to light up. One-by-one, they illuminate a faint path leading into the ` +
          `darkness. You can't quite see the end of it`,
      ],
      options: {
        SHINE_LIGHT: `Use your space light to see where the path leads`,
        FOLLOW_PATH: `Follow the path of the glowing floor panels.`,
      },
    },
    FOLLOW_PATH: {
      prompt: [
        `You start to quietly walk along the path. After a while, you begin to make out the end of the glow panel path. ` +
          `As you get closer, you realize you are approaching the far wall of the room, and the path ends in a large, ` +
          `circular door, which is currently closed. Suddenly, the lights in the room all turn on at once. As your eyes ` +
          `adjust to the brightness, you hear a faint mechanical sound directly ahead of you.`,
        `The door starts to slide open.`,
      ],
      options: {
        STAY_IN_FRONT_OF_DOOR: `Stay where you are.`,
        HIDE_NEXT_TO_DOOR: `Run and try to hide against the side of the door.`,
      },
    },
    STAY_IN_FRONT_OF_DOOR: {
      prompt:
        `The door opens on a dark room. You can see the faint shape of a humanoid moving toward you in the ` +
        `darkness. As it gets closer, you realize it has a metal helmet or head.`,
      options: {
        MEET_ANDROID: [`Stand there awkwardly.`, `Wave hello.`],
      },
    },
    HIDE_NEXT_TO_DOOR: {
      prompt:
        `You quickly press yourself against the side of the door as it opens. A figure walks out, looking directly ` +
        `ahead. It has a shining, metal head atop a humanoid body. The faint metallic sound accompanying each of its ` +
        `movements makes you think this is an android.`,
      options: {
        MEET_ANDROID: `Stay put`,
        SNEAK_THROUGH_DOOR: `Try to sneak through the door before it closes.`,
      },
    },
    SNEAK_THROUGH_DOOR: {
      prompt:
        `You run through the open door and it shuts smoothly behind you. Lights flicker on, illuminating a short ` +
        `corridor. The smell of rotten meat is even more intense here. There are several locked doors leading off of ` +
        `this passage, each with a pin pad next to it. The door at the end of the hall isn't fully shut.`,
      options: {
        INVESTIGATE_DOOR: `Investigate the door at the end of the hall.`,
        BACK_TO_BIG_ROOM: `Go back through the door you came from.`,
      },
    },
    INVESTIGATE_DOOR: {
      prompt: [
        `You walk to the end of the corridor. The door at the end looks broken; the pin pad isn't lit up like the ` +
          `others and the bottom of the door itself isn't properly seated in it's track. The gap isn't quite big ` +
          `enough to fit through, but you can easily see into the room beyond.`,
        `You peer inside, and you see the dim glow of a hibernation chamber. It looks like it's currently in use.`,
      ],
      options: {
        SNEAK_HIBERNATION_ROOM: `Try to open the door.`,
        BACK_TO_BIG_ROOM: `Go back through the door you came from.`,
      },
    },
    SNEAK_HIBERNATION_ROOM: {
      prompt: [
        `You try to pull the door to the side, and it slides open another few inches with a grating sound. Now the ` +
          `opening is large enough to fit through, but it also has automatically turned on the broken motor, which whines ` +
          `loudly (but doesn't do anything other than that). The sound echoes down the hall, but after a few moments it stops. `,
        `Suddenly, you hear the door you just came from start to open again.`,
      ],
      options: {},
    },
    BACK_TO_BIG_ROOM: {
      prompt:
        `You turn back around. The door has a button next to it marked with an "open" symbol. You press it, and ` +
        `the door slides open. You walk through the door. The android is facing away from you, but starts to turn around.`,
      options: {
        MEET_ANDROID: [`Stand there awkwardly.`, `Wave hello.`],
      },
    },
    CHECK_SENSORS: {
      prompt: `You send out a bio-pulse and try to get a reading. It comes back negative: you are the only living thing on this ship.`,
      options: {
        EXIT_AIRLOCK: `Step out of the airlock as quietly as possible.`,
        SHINE_LIGHT: `Use your space light to see what is outside of the hatch.`,
      },
    },
    SHINE_LIGHT: {
      prompt: [
        `You switch on your space light and aim the beam across the room. It is huge but mostly empty, save for some haphazard piles of metallic debris.`,
        `As the light roves across the space, it briefly passes over what must be the exit. You shine it back towards the exit, just as the lights in the room all turn on at once.`,
        `With a faint whir, the exit portal slides open.`,
      ],
      options: {
        STAY_ON_SHIP: `Retreat back into your ship.`,
        EXIT_AIRLOCK_NO_SNEAKY: `Walk toward the exit portal.`,
      },
    },
    STAY_ON_SHIP: {
      prompt: `todo`,
      options: {},
    },
    EXIT_AIRLOCK_NO_SNEAKY: {
      prompt: [
        `You walk toward the exit that just opened up across the room.`,
        `As you get closer, you think you see a figure coming toward you from the shadows of the room beyond.`,
        `As the figure steps into the room you are in, you make out a human-like body with a gleaming metal head. This is an android.`,
      ],
      options: {
        MEET_ANDROID: [`Stand there awkwardly`, `Say hello`],
      },
    },
    MEET_ANDROID: {
      prompt: [
        `With a faint whirring of many small servos, the android turns toward you.`,
        `You stand facing each other for a brief moment, before you realize the android is your old friend Pippin! ` +
          `Her face lights up with a glowing smile as she recognizes you.`,
        `"Sfinx! I can't believe you are here!"`,
        `But after a moment, her face lights dim and her features fall into an expression that you don't recognize ` +
          `from the time you've spent together. Regret? Ennui?`,
      ],
      options: {
        GREET_PIP: `"Pip! It's so good to see you! What's going on?"`,
        PIP_DEAD: `"I thought you were dead!"`,
      },
    },
    GREET_PIP: {
      prompt: [
        `Pip lets out a flat wail of despair that echoes across the room.`,
        `"Oh Sfinx, you don't want to know. The situation here is..."`,
        `She pauses, and you think you see the light behind her eyes dim for a moment. Abruptly, she stands up ` +
          `straight, and the familiar purple glow returns to her eyes. She looks at you.`,
        `"The situation is bad, Sfinx. You'll have to come with me and see for yourself. Gravlax can explain everything."`,
        `She turns to walk toward the door, and says "Follow me, and don't take off that radiation suit."`,
      ],
      options: {
        FOLLOW_PIP: `Follow Pip`,
        CHASE_DEAD: [
          `"Wait, what happened to Chase?"`,
          `"Gravlax? Why should I trust her? Chase said she was up to no good!"`,
        ],
      },
    },
    PIP_DEAD: {
      prompt:
        `"Dead! Oh no, not dead. Mind you, I'm not sure that's for the best, but no, I'm still cranking along. ` +
        `Who told you that? Chase? Poor, misguided soul.`,
      options: {
        CHASE_DEAD: [`"Yes, he sent me a letter.`, `"What happened to Chase?"`],
      },
    },
    CHASE_DEAD: {
      prompt: [
        `A tinny sign issues from Pippin's voice box.`,
        `"Poor Chase... He just wanted to protect the empire. He was too trusting; too naive. He didn't deserve his fate."`,
        `He died, Sfinx. Gravlax couldn't tell him what was really going on, and he tried to stop her. Come with me; ` +
          `Gravlax will tell you everything that happened.`,
      ],
      options: {
        FOLLOW_PIP: `Follow Pip.`,
        WHY_TRUST_GRAVLAX: `"But Chase didn't trust Gravlax! Why should I?"`,
      },
    },
    WHY_TRUST_GRAVLAX: {
      prompt:
        `Chase was wrong, Sfinx! He didn't know everything that was going on. I promise you, if you can trust me, ` +
        `you can trust Gravlax! She's uncovered something big. Please, just come with me and she can explain it all!`,
      options: {
        FOLLOW_PIP: `Follow Pip`,
      },
    },
    FOLLOW_PIP: {
      prompt: `todo`, // todo
      options: {},
    },
  };
};
//   MEET_GRAVLAX: {
//     prompt: `"Hi, I am Gravlax and I am actually good! My daughter got kidnapped to become a royal priestess, but I` +
//         `think that's bullshit. I just found out where she is, but now I am dying of radiation poisoning. Will you ` +
//         `save her? The code to open the box is 785."`,
//     options: [
//       [`THANK_GRAVLAX`, `"Thank you"`],
//       [`THANK_GRAVLAX`, `"Well this feels a bit too easy..."`],
//     ]
//   },
//   THANK_GRAVLAX: {
//     prompt: `"Oh sure, couldn't make this too complicated since Eli is just making sure it works! Inside the box, you` +
//         ` will find the last mail drop I ever got from Gorgo. The password is her name."`,
//     options: [
//       [`START_FIND_DAUGHTER_MISSION`, `"Hmmm..."`],
//       [`START_FIND_DAUGHTER_MISSION`, `"I guess that makes sense...?"`],
//       [`START_FIND_DAUGHTER_MISSION`, `"Well, you are the expert!"`],
//     ]
//   },
//   START_FIND_DAUGHTER_MISSION: {
//     prompt: `"Where are we going today?"`,
//     options: [],
//     travelInfo: {
//       failure: "CRASH_2",
//     }
//   },
//   CRASH_2: {
//     prompt: `It didn't work. Your ship has crashed and now you're dead. :(`,
//     options: [
//       [`START_FIND_DAUGHTER_MISSION`, `Retry?`]
//     ]
//   },
//   TRAVEL_NODE_2: {
//     prompt: `Warp jump successful! Where to?`,
//     options: [],
//     travelInfo: {
//       failure: "CRASH_2",
//       success: "SUCCESS_2"
//     }
//   },
//   SUCCESS_2: {
//     prompt: `"Hi, I am Gorgonzola! You rescued me, good job! The final code is 802."`,
//     options: []
//   }
// }
