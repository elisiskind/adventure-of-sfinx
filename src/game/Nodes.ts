import { CloudStorage, Updates } from "../storage/CloudStorageProvider";
import { Sound } from "../storage/NodeTransitionProvider";
import { Coordinate } from "./Coordinates";

type TextOptionWithUpdates = { prompt: string; updates: Updates };
export type Option = string | TextOptionWithUpdates;
type TextOptions = Partial<{ [key in NodeId]: Option | Option[] }> | NodeId;

const isString = (option: Option | Option[]): option is string => {
  return typeof option === "string";
};

export interface DestructuredOption {
  nodeId: NodeId;
  prompt?: string;
  updates?: Updates;
}

const destructureOption = (
  option: Option,
  nodeId: NodeId
): DestructuredOption => {
  if (isString(option)) {
    return {
      nodeId,
      prompt: option,
    };
  } else {
    return {
      nodeId,
      prompt: option.prompt,
      updates: option.updates,
    };
  }
};

export const destructureOptions = (
  options: TextOptions
): DestructuredOption[] => {
  if (typeof options === "string") {
    return [
      {
        nodeId: options,
      },
    ];
  } else {
    return Object.entries(options).flatMap(([id, option]) => {
      const nodeId = id as NodeId;
      if (Array.isArray(option)) {
        return option.map((opt) => destructureOption(opt, nodeId));
      } else {
        return [destructureOption(option, nodeId)];
      }
    });
  }
};

export type ShipStatus =
  | "warning"
  | "critical"
  | "warp-warning"
  | "warp-critical";

export interface TextNode {
  prompt: string | string[];
  options: TextOptions;
  onTransition?: Updates;
  travelInfo?: {
    failure: NodeId;
    success: NodeId;
    target?: {
      node: NodeId;
      coordinates: Coordinate;
    };
  };
  showSpaceship?: boolean;
  mission?: string;
  geiger?: 1 | 2 | 3;
  status?: ShipStatus;
  engineOn?: boolean;
  sound?: Sound;
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
  STAY_ON_SHIP_DOOR_OPEN,
  RETREAT_TO_SHIP,
  FOLLOW_PATH,
  FOLLOW_PATH_2,
  FOLLOW_PATH_3,
  FOLLOW_PATH_4,
  STAY_IN_FRONT_OF_DOOR,
  HIDE_NEXT_TO_DOOR,
  MEET_ANDROID,
  SHOOT_ANDROID,
  SHOOT_ANDROID_2,
  SNEAK_THROUGH_DOOR,
  INVESTIGATE_DOOR,
  BACK_TO_BIG_ROOM,
  SNEAK_HIBERNATION_ROOM,
  SNEAK_HIBERNATION_ROOM_2,
  GREET_PIP,
  PIP_DEAD,
  CHASE_DEAD,
  WHY_TRUST_GRAVLAX,
  FOLLOW_PIP,
  AWAKEN_GRAVLAX,
  INTRODUCE_YOURSELF,
  GRAVLAX_EXPLAINS,
  WHAT_ABOUT_CHASE,
  FEE_PLEASE,
  WHAT_CODE,
  CRASH_0,
  CRASH_1,
  STARVE_TO_DEATH,
  FINED_BY_SPACE_CATS,
  START_RESCUE_MISSION,
  RESCUE_COORDINATES,
  OPEN_BOX,
  CRASH_2,
  CRASH_3,
  SECOND_WARP,
  SECOND_WARP_2,
  SUCCESS_WARP_2,
  FIND_PLANET,
  RECONNAISSANCE,
  RECONNAISSANCE_2,
  APPROACH_PLANET,
  LAND,
  EXIT_SHIP,
  STAY_PUT,
  ENTER_DOOR,
  LEAVE_THE_PLANET,
  DESCEND,
  HERE_TO_SAVE,
  DESTROY_BOX,
  EAT_BEANS,
  THE_END,
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
        START_1: "Try again?",
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
      onTransition: {
        airlockTime: 0,
        mission: "Find Chase in coordinates 1D",
      },
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
      onTransition: {
        airlockTime: context.airlockTime + 1,
      },
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
      onTransition: {
        airlockTime: context.airlockTime + 1,
      },
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
        START_1: "Try again?",
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
        COORDINATES_1: `Try again?`,
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
        CHECK_SENSORS: `Send out a bio-pulse to check sensors for signs of life.`,
      },
      showSpaceship: true,
      onTransition: {
        gunDrawn: false,
      },
      sound: "airlockHiss",
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
    CHECK_SENSORS: {
      prompt: `You release a bio-pulse and it comes back negative: if anything is alive on this ship, it is deep in cold
       sleep. Either that, or your bio-pulse is defective.`,
      options: {
        EXIT_AIRLOCK: `Step out of the airlock as quietly as possible.`,
      },
      showSpaceship: true,
    },
    SHINE_LIGHT: {
      prompt: [
        `You switch on your space light and aim the beam across the room. It is huge but mostly empty, save for some haphazard piles of metallic debris.`,
        `As the light roves across the space, it briefly passes over what must be the exit.`,
      ],
      options: {
        STAY_ON_SHIP_DOOR_OPEN: `Stay where you are`,
        FOLLOW_PATH: `Walk toward the exit portal.`,
      },
    },
    STAY_ON_SHIP_DOOR_OPEN: {
      prompt: [
        `You nervously pace back and forth as you decide what to do. After some deliberation, you realize
        there is only one way forward - you have to explore that ship. You would never admit it to Chase, but you aren't
        just doing this for the reward; you want to make sure he is ok. Suddenly, the lights in the room all turn on at 
        once.`,
      ],
      options: {
        FOLLOW_PATH_3: [
          `Slowly sneak down the path.`,
          {
            prompt: `Draw your gun and step outside`,
            updates: { gunDrawn: true },
          },
        ],
      },
    },
    FOLLOW_PATH: {
      prompt: `You start to quietly walk along the path. As you get closer to the end of the glow panels, you realize 
      you are approaching the far wall of the room, and the path ends in a large, circular door, which is currently 
      closed. Suddenly, the lights in the room all turn on at once. As your eyes adjust to the brightness, you hear a 
      faint mechanical sound directly ahead of you.`,
      options: "FOLLOW_PATH_2",
    },
    FOLLOW_PATH_2: {
      prompt: `The door starts to slide open.`,
      sound: "openDoor",
      options: {
        STAY_IN_FRONT_OF_DOOR: context.gunDrawn
          ? "Stay where you are."
          : [
              `Stay where you are.`,
              {
                prompt: "Draw your laser gun",
                updates: { gunDrawn: true },
              },
            ],
        HIDE_NEXT_TO_DOOR: `Run and try to hide against the side of the door.`,
        RETREAT_TO_SHIP: `Retreat back to your ship.`,
      },
    },
    RETREAT_TO_SHIP: {
      prompt: `You sneak back onto your ship as quickly and quietly as possible, given that you are wearing magnetic 
      space boots.`,
      options: "STAY_ON_SHIP",
    },
    STAY_ON_SHIP: {
      prompt: [
        `You retreat back onto your ship, and pace back and forth for a moment. After some deliberation, you realize
        there is only one way forward - you have to explore that ship. You would never admit it to Chase, but you aren't
        just doing this for the reward; you want to make sure he is ok.`,
      ],
      options: {
        FOLLOW_PATH_3: [
          `Slowly sneak down the path.`,
          {
            prompt: `Draw your gun and step outside`,
            updates: { gunDrawn: true },
          },
        ],
      },
    },
    FOLLOW_PATH_3: {
      prompt: `You start to quietly walk along the path${
        context.gunDrawn ? " with your gun drawn" : ""
      }.`,
      options: "FOLLOW_PATH_4",
    },
    FOLLOW_PATH_4: {
      prompt: `Suddenly the door opens with a faint whir.`,
      options: {
        STAY_IN_FRONT_OF_DOOR: context.gunDrawn
          ? "Stay where you are."
          : [
              `Stay where you are.`,
              {
                prompt: "Draw your laser gun",
                updates: { gunDrawn: true },
              },
            ],
        HIDE_NEXT_TO_DOOR: `Run and try to hide against the side of the door.`,
      },
      sound: "openDoor",
    },
    STAY_IN_FRONT_OF_DOOR: {
      prompt: `You can see the faint shape of a humanoid moving toward you in the darkness. As it gets closer, you realize
          it has a metal helmet or head.`,
      options: context.gunDrawn
        ? {
            MEET_ANDROID: [`Stand there awkwardly.`, `Wave hello.`],
            SHOOT_ANDROID: `Fire your laser gun at the approaching figure.`,
          }
        : {
            MEET_ANDROID: [`Stand there awkwardly.`, `Wave hello.`],
          },
    },
    SHOOT_ANDROID: {
      prompt: [
        `You fire your drawn weapon in the blink of an eye, just as you register that the figure is an android. 
        Unfortunately, the android's programming includes a laser duel subroutine, and in that same moment has 
        already mirrored your movements.`,
        `Your shot was good; you can see that you have completely melted the neural core located in the android's upper 
        torso. As the android collapses to the floor, you recognize her face: it is your old friend Pippin!`,
      ],
      options: "SHOOT_ANDROID_2",
      status: "warning",
    },
    SHOOT_ANDROID_2: {
      prompt: `As you start to realize what you just did, you feel a dull pain spreading in your chest. In the blur, you
      hadn't even realized that Pippin had shot you back. With the characteristic precision of an android, her blast 
      hit you directly in the heart. You rapidly lose conscious, but not before shedding a single tear.`,
      options: {
        DOCK_WITH_SHIP: "Try again?",
      },
      status: "critical",
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
        INVESTIGATE_DOOR: context.gunDrawn
          ? `Investigate the door at the end of the hall.`
          : [
              `Investigate the door at the end of the hall.`,
              {
                prompt: "`Investigate the door, but draw your laser gun first",
                updates: { gunDrawn: true },
              },
            ],
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
      prompt: `You try to pull the door to the side, and it slides open another few inches with a grating sound. Now the
      opening is large enough to fit through, but it also has automatically turned on the broken motor, which whines 
      loudly and snaps the door shut. The sound echoes down the hall, but after a few moments it stops.`,
      options: "SNEAK_HIBERNATION_ROOM_2",
    },
    SNEAK_HIBERNATION_ROOM_2: {
      prompt: `Suddenly, you hear the door you just came from start to open again.`,
      options: context.gunDrawn
        ? {
            MEET_ANDROID: [`Stand there awkwardly.`, `Wave hello.`],
            SHOOT_ANDROID: `Fire your laser gun at the approaching figure.`,
          }
        : {
            MEET_ANDROID: [`Stand there awkwardly.`, `Wave hello.`],
          },
      sound: "openDoor",
    },
    BACK_TO_BIG_ROOM: {
      prompt:
        `You turn back around. The door has a button next to it marked with an "open" symbol. You press it, and ` +
        `the door slides open. You walk through the door. The android is facing away from you, but starts to turn around.`,
      options: context.gunDrawn
        ? {
            MEET_ANDROID: [`Stand there awkwardly.`, `Wave hello.`],
            SHOOT_ANDROID: `Fire your laser gun at the approaching figure.`,
          }
        : {
            MEET_ANDROID: [`Stand there awkwardly.`, `Wave hello.`],
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
      prompt: [
        `You follow Pippin down the corridor to the door at the end of the hall. She ignores the keypad, and with
       a practiced motion, braces her back against a wall to push the automatic door with her feet. Evidently the door
       is broken, but it grinds open a foot or two.`,
        `You enter a small, dark room lit only by the bluish glow of a hibernation chamber pushed up against the far wall.
       The light is coming from a frosty glass panel near the top, and behind it you see a face with a protruding snout
       covered in short black fur.`,
        `Pippin looks at you, and then presses some buttons on the side.`,
      ],
      options: "AWAKEN_GRAVLAX",
    },
    AWAKEN_GRAVLAX: {
      prompt: [
        `The front of the coffin-like hibernation chamber unlatches with an echoing bang, and steam pours out of the 
          sides. A frail four-legged figure covered in waving blue tentacles rolls forward into the arms of Pippin.
          Blinking, she looks at you in confusion, as Pippin helps her into a radiation suit.`,
        `"Gravlax, this is my friend Sfinx. She is here to help us."`,
      ],
      options: {
        INTRODUCE_YOURSELF: `"Hi Gravlax, great ta meet ya. I'm Sfinx."`,
        GRAVLAX_EXPLAINS: `"Now just hold on a moment, not until you tell me what's going on!"`,
      },
      sound: "pop",
    },
    INTRODUCE_YOURSELF: {
      prompt: `Gravlax looks at you, bemused, before breaking into a coughing spell. She spits a gob of blood on the
       ground and frowns.\n "I wish we were meeting in better conditions. Has Pippin filled you in?"`,
      options: {
        GRAVLAX_EXPLAINS: [
          `"Not really."`,
          `"I'm more confused than a Zoflaxian pangrove in a femptolaser store!"`,
        ],
      },
    },
    GRAVLAX_EXPLAINS: {
      prompt: [
        `"If Pippin trusts you, then I have no choice but to to trust you as well. I will tell you everything I know."`,
        `"It all started last year. My daughter was selected as a Galactic Priestess candidate. I know I should have 
        been overjoyed, but I really was just sad to have to let her go. She was my everything."`,
        `"We got ready for her trip. They wouldn't let her bring much, so it was mostly just saying goodbye to her 
        friends and family, and tying off some loose ends. As we prepared, I started wondering what it's really like to 
        be a Galactic Priestess. I started asking around, surreptitiously, to see if any of my colleagues knew what
        would happen to her. I heard all kinds of stories; she would be granted magical powers, she would have to fight 
        the other candidates, she would be forced to eat the body last Galactic Princess. I didn't believe any of them, 
        at first."`,
        `"The day finally came when it was time for my daughter to leave. I took her to the spaceport and kissed her
        goodbye. It was hard knowing I would never see her again, even if she wasn't chosen, but I was proud that she
        was serving our empire."`,
        `Gravlax pauses her story to cough again. She seems weak and out of breath. You haven't met too many individuals
        of her species before, but you suspect she is missing more patches of fur than usual, and her tentacles might
        not normally be so gray and flaky.`,
        `"But then I heard something that scared me. A friend, Merry, who had spent many years serving the Galactic 
        Empire before an injury meant he needed to enter cold sleep for nearly 35 years, was alive during the last
        transition of princesses, almost 100 years ago. He was working as a laborer contracted by the empire to do
        some odd jobs. He said that he had been taken to a planet he had never been to, the location of which was
        top-secret. This wasn't too unusual, but the job was like nothing else he had ever done."`,
        `"He worked as a sort of lab assistant in a very strange lab. Most of the day-to-day work wasn't too interesting;
        just things like disposing of lab waste, cleaning used equipment, or delivering food to the government officials
         working in the lab. He was never able to see what the work they were doing was, but one day he saw a body being
         carried out of one of the rooms. He recognized the face of the body immediately - he had seen her on his
         ansible the night before. She was featured in a show about the Galactic Princess candidates, as she had just 
         been selected."`,
        `"Merry had seen the corpse of a Royal Princess candidate in a secret government lab."`,
        `"He never found out what had happened to her, but after that, he never believed the official story that the
         Priestess candidates who were not selected were sent on top secret missions to serve the empire until their
         retirements."`,
        `"I don't know what they were doing up there, but I can't let them do it to my daughter. Will you help me?"`,
      ],
      options: {
        WHAT_ABOUT_CHASE: `"I don't know... you still haven't explained what happened to Chase!"`,
        FEE_PLEASE: `"How much are you willing to pay?"`,
      },
    },
    FEE_PLEASE: {
      prompt: `"At this point, anything. I'm dying, Sfinx. The Royal Galactic Empire compensates the family of a Royal
    Reconnaissance Lieutenant Commander very well in the event of their death, and since my daughter is--"`,
      options: {
        WHAT_ABOUT_CHASE: `"Yeah, yeah, I know all about the Galactic life insurance policy or whatever. I'll take it. 
        Now tell me what happened to Chase."`,
      },
    },
    WHAT_ABOUT_CHASE: {
      prompt: [
        `Gravlax sighs.`,
        `"Chase was a good man. He didn't deserve his fate. I just wish he didn't take the rest of us down with him 
          too."`,
        `"Chase knew I was up to something. I was planning a rescue mission for my daughter, but I knew he would never
          agree to go rogue, and especially not if it meant directly opposing Galactic Royalty. I had never told Chase 
          that my daughter was one of the candidates for Priestess; she could always keep a secret and neither of us
          wanted the attention. So I am sure Chase had no idea what I was up to."`,
        `"The only one I knew I could trust was Pippin, and that was no good because she is a Galactic Royal Android,
          with a direct link to the Galactic Royal Space Network. I don't know exactly how her uplink works, but I am
          sure anything I told her could be monitored by the Space Military."`,
        `"I knew I couldn't do this alone, so I took Pippin offline myself and removed the network drive in her arm. 
          It meant that she was no longer connected to the Royal Space Network, and I could speak with her freely. I 
          know it was a difficult adjustment for her, but when I took her back online and told her my plan she agreed to
           stay  disconnected."`,
        `Pippin nods in agreement.`,
        `"Unfortunately, Chase noticed I had been doing work on Pippin. He thought I killed her, and was livid at the
          betrayal. He hatched a plan to thwart me, but before he could do anything I caught him lurking outside of my
          office. Pipping and I were forced to detain him in the engine room."`,
        `"I tried to explain my plan, but all he could hear is that we wanted to kidnap the galactic priestess. He
        wouldn't listen to reason, and in a last attempt to stop us, he took a drastic step."`,
        `"Rather than let us carry out our mission, he disabled our worm coor drive. But the idiot has never been a 
          mechanic. I don't know if he meant to or not, but he breached the reactor core itself."`,
        `"Not everyone realized what happened at first. We saw the Check Space Engine light turn on, but we didn't
          know how enormous the radiation levels were. Those closest to the engine room succumbed to radiation poisoning
          almost instantly. The rest of us felt a sudden warmth. I was with Pippin at the time, and she had the 
          foresight to get me into a radiation suit almost immediately, but we both knew it wouldn't be enough."`,
        `"Over the next few days, everyone else succumbed to the radiation. It was horrible and slow. I knew I didn't
         have long, and our ship was dead in the water anyway, so Pippin and I decided it would be best to put me in
         cold sleep until someone found us."`,
        `Suddenly, Gravlax slumps over. You and Pippin hold her up on either side, but she is weak. The shock of 
          leaving cold sleep, and the effort of retelling her story was too much for her. Her eyes close, and the
          trembling of her paws and waving of her tentacles still.`,
        `She croaks out "The code is 785", and dies in your arms. From a fold within her tentacles falls a small
         rectangular metal box.`,
      ],
      options: {
        WHAT_CODE: `"What code is she talking about?"`,
      },
    },
    WHAT_CODE: {
      prompt: `Pippin looks at you, looks down to the box, and looks at you again. She raises an eyebrow.`,
      options: {},
    },
    OPEN_BOX: {
      prompt: [
        `Pippin gasps when you open the box, "Those are wormcoor navigation discs! With those we can travel anywhere 
          in the galaxy without having to get a course calculation from the Royal Galactic Network! I can't believe Gravlax had those."`,
        `To avoid radiation damage, you and Pippin decide to head back to your ship.`,
      ],
      options: "START_RESCUE_MISSION",
    },
    START_RESCUE_MISSION: {
      prompt: `Shipsley: "Welcome back, Sfinx! I hope you had a lovely time aboard that other ship!"`,
      options: {
        RESCUE_COORDINATES: [
          `"Read the room Shipsley, it was bleak. We've got places to go now though."`,
          `"Shipsley, I'll need you to set a course for another wormcoor jump."`,
        ],
      },
      showSpaceship: true,
      onTransition: {
        gunDrawn: false,
      },
    },
    RESCUE_COORDINATES: {
      prompt: `Shipsley: "Sure thing boss! Just punch in those coordinates!"`,
      options: {},
      travelInfo: {
        failure: `CRASH_2`,
        success: `SECOND_WARP`,
      },
      showSpaceship: true,
    },
    SECOND_WARP: {
      prompt: `Shipsley: "Where to next?"`,
      options: {},
      travelInfo: {
        failure: `CRASH_2`,
        success: `SECOND_WARP_2`,
        target: {
          node: "SUCCESS_WARP_2",
          coordinates: "4E",
        },
      },
      showSpaceship: true,
    },
    SECOND_WARP_2: {
      prompt: `Shipsley: "Where to next?"`,
      options: {},
      travelInfo: {
        failure: `CRASH_2`,
        success: `SECOND_WARP`,
        target: {
          node: "SUCCESS_WARP_2",
          coordinates: "4E",
        },
      },
      showSpaceship: true,
    },
    CRASH_2: {
      prompt: `The hum of your wormcoor drive increases to a whine, and then a shriek, before it is violently cut off. Your
        ship was never built to withstand the wormhole differential pressure it is now experiencing. You can see the
        walls of your ship bulging inwards - or is that just the warping of spacetime itself? You can feel the blood 
        vessels in your eyes popping, and your head pounding.`,
      options: "CRASH_3",
      showSpaceship: true,
      status: "warp-warning",
    },
    CRASH_3: {
      prompt: `Finally you begin to black out, knowing there is no way you will come out of this alive. The last thing
      you hear is the voice of your ship, repeating your name...`,
      options: {
        SECOND_WARP: {
          prompt: `Try again?`,
          updates: {
            coordinates: "1D",
            history: ["3A", "1D"],
          },
        },
      },
      showSpaceship: true,
      status: "warp-critical",
    },
    SUCCESS_WARP_2: {
      prompt: 'Shipsley: "Looks like we are here!"',
      options: "FIND_PLANET",
    },
    FIND_PLANET: {
      prompt: [
        `You exit the final wormhole jump into a forgotten part of the galaxy, close to the galactic core. Even at this 
        distance, you know that the black hole at the center of the galaxy is slowing down your relative time.`,
        `There are so few settlements this far into the galaxy that you guess the princess must have been sent
        somewhere close to the wormhole exit. You scan for nearby planets, and sure enough, there is a medium-sized
        rocky planet in the nearest system.`,
        `Pippin says, "That must be where she is. Should we just go for it?"`,
        `Your ship is relatively small and stealthy, but even so, you feel like you shouldn't linger here for long.`,
      ],
      options: {
        APPROACH_PLANET: `Set a course for the planet`,
        RECONNAISSANCE: `Do some reconnaissance first`,
      },
      showSpaceship: true,
      sound: "music",
    },
    RECONNAISSANCE: {
      prompt: `You go to start setting up some sensors to see if you can a better sense of what might be waiting for you.
      Then, without warning, a royal destroyer appears in the wormhole event horizon. The big warship turns toward your
      small cruiser and fires a single blast from it's laser cannon. You can't believe you got this far only to be
      destroyed by the royal galactic military.`,
      options: "RECONNAISSANCE_2",
      showSpaceship: true,
      status: "warning",
    },
    RECONNAISSANCE_2: {
      prompt: `The blast hits your ship and completely overwhelms your shields, turning everything instantly into plasma.`,
      showSpaceship: true,
      status: "warp-critical",
      options: {
        FIND_PLANET: "Try again?",
      },
    },
    APPROACH_PLANET: {
      prompt: `You fly down to the planet. Your sensors detect life only in a single spot. As you orbit the planet, you
      see that it is rocky and completely barren, save for a single small outpost. You descend to the outpost, and
      see a small space garage with an open door, just big enough to fit your ship.`,
      options: {
        LAND: "Land in the space garage.",
      },
      showSpaceship: true,
      sound: "hum",
    },
    LAND: {
      prompt: [
        `You slowly circle the garage as you descend. You don't actually see anything around it; maybe this facility
          is underground? You hope it isn't abandoned.`,
        `You smoothly enter the open door, and land with barely a bump. As soon as the feet of your ship contact the
          garage floor, the door closes behind you. It seems your presence is known.`,
      ],
      showSpaceship: true,
      options: {
        EXIT_SHIP: ["Exit your ship."],
        STAY_PUT: [
          "Stay where you are",
          {
            prompt: "Draw your weapon.",
            updates: { gunDrawn: true },
          },
        ],
      },
    },
    STAY_PUT: {
      prompt: [
        `${
          context.gunDrawn
            ? "You draw your laser gun, and hold it low as y"
            : "Y"
        }ou peer out the window. You 
      can't see much in the darkness, but it does look like an official empire installation. You can see the Galactic
      Royal Space Seal printed on the wall, at least. There is a door to the left of you, but it's closed.`,
      ],
      options: {
        ENTER_DOOR: "Open the door",
        LEAVE_THE_PLANET: `Try to blast through the garage and make an escape.`,
      },
      showSpaceship: true,
    },
    LEAVE_THE_PLANET: {
      prompt: `You start up the engines again, and try to blast through the door. The door is stronger than it looked;
      your ship explodes in fireball. No one survives.`,
      showSpaceship: true,
      engineOn: true,
      status: "critical",
      options: {
        LAND: "Try again?",
      },
    },
    EXIT_SHIP: {
      prompt: [
        `Pippin offers to stay and watch the ship. You know she is just scared, but you don't blame her. She has
      never been a fighter. You quietly exit your ship.`,
        `You see a single door with a button next to it. You press it.`,
      ],
      options: "DESCEND",
    },
    ENTER_DOOR: {
      prompt: [
        `Pippin offers to stay and watch the ship. You know she is just scared, but you don't blame her. She has
      never been a fighter. You exit your ship and walk over the door.`,
        `There is a single button on the side. You press it.`,
      ],
      options: "DESCEND",
    },
    DESCEND: {
      prompt: [
        `A moment or two later, there is a ding, and the door opens into a small room. You step inside, and the door 
          closes.`,
        `Suddenly you feel a rapid downward acceleration. This is an elevator.`,
        `After what feels like a while, the elevator starts to slow down. You must be hundreds of space-yards 
          underground. You step back slightly as the door opens again.`,
        `As the door slides aside, you see you are in a giant cavern. And, walking toward you, Gorgonzola.`,
        `You don't know how to read the expressions of her species, but you think she might be surprised.`,
        `"Welcome to the Royal Galactic Princess chambers."`,
      ],
      options: {
        HERE_TO_SAVE: [
          `"Hi, I'm Sfinx and I am here to rescue you."`,
          `"The what??"`,
        ],
      },
      sound: "ding",
    },
    HERE_TO_SAVE: {
      prompt: [
        `"We don't have much time- the galactic military is on its way. I can't believe you
      found me! I assume my mother sent you?"`,
        `You nod. "But there is something you should-"`,
        `Gorgo: "I know - she's dead. I'm sort of telepathic now."`,
        `"That's what the Galactic Princess is for. A long time ago, the Royal Galactic Empire discovered a special
          substance in the core of a distant planet. When consumed, it had the power to induce telepathy."`,
        `"The reach was limited; normally you could only sense the minds of those around you. But the more you ate, the farther
          your reach was. But there was a cost; it would shorten your lifespan drastically."`,
        `"The empire realized they could use this to their advantage. They couldn't let anyone in on the secret, but
          the only needed a single telepath anyways. Not everyone has the mental capacity to handle the process, so
          they decided to select 100 candidates and test each one until they found someone who could handle it"`,
        `"The other candidates were killed."`,
        `Gorgo pauses to lick her paw, and rub her face with a tentacle.`,
        `"Whoever was chosen was sent here, where their short life would be at least 100 years of relative time in the
          rest of the galaxy. Their brain would be hooked up to an ansible, and they could monitor every single person
           in the galaxy at once while directly transmitting this data for the empire to use."`,
        `"This is the secret of how the empire has risen to power and stayed there. Anyone who wants to rebel can
          be destroyed before they even start. None could ever stand a chance against this new power."`,
        `"I was chosen for this task. They told me they would kill my mother if I stopped transmitting. They left
          me here, and I had no choice but to eat the telepath beans and spy on the entire galaxy. It was so much
          information all at once that I couldn't even process it myself. But the empire could."`,
        `"This is what I thought my life would be, up until a few minutes ago, when I felt my mother's death. Without
           leverage over me, I knew the empire would try to get rid of me or torture me in some new way... I stopped 
           transmitting. I am sure they are on their way now."`,
        `"But this couldn't go on forever anyways. They are running out of telepath beans. In fact, there are only
          enough left for my reign as princess, or, if you took them sparingly, a single normal lifetime."`,
        `"I can see your mind - I know you have nothing to hold you back. Will you take them for me, and bring down
          the Royal Galactic Empire?"`,
        `She hands you a metal box.`,
        `"This is the rest of the beans. The code is 802. The choice is yours, Sfinx. Do with them what you will."`,
      ],
      options: {
        DESTROY_BOX: "Destroy the beans.",
        EAT_BEANS: "Eat the beans",
      },
    },
    DESTROY_BOX: {
      prompt: [
        `After hearing about this power, you know it is too much for anyone to have. You take the box
      from Gorgo, and set your laser gun to blast mode. You place the box on the floor and fire a single shot, directly
       into it. There is a cloud of smoke, and the beans are no more.`,
        `You don't know what will happen now, but no one else does either. You think this is probably a good thing.`,
      ],
      options: "THE_END",
    },
    EAT_BEANS: {
      prompt: [
        `You take the box from Gorgo, and eat a bean. Suddenly, you feel your consciousness expand. You can sense 
        some soldiers above you, but you know exactly what they will do next.`,
        `You unholster your laser gun. All you need is your gun, your ship, and your new powers, and you know you can
        never be stopped. Time to bring down an empire.`,
      ],
      options: "THE_END",
    },
    THE_END: {
      prompt:
        "Thus ends the Adventure of Sfinx, space bounty hunter and savior of the galaxy.",
      options: {},
      sound: "endMusic",
    },
  };
};
//   SUCCESS_2: {
//     prompt: `"Hi, I am Gorgonzola! You rescued me, goodr job! The final code is 802."`,
//     options: []
//   }
// }
