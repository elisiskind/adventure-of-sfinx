export type TextOption = [NodeId, string];

export interface TextNode {
  prompt: string | string[];
  options: TextOption[];
  travelInfo?: {
    failure: FailureNodeId;
    success?: NodeId;
  }
}

export enum Node {
  START_1,
  LEFT_1,
  RIGHT_1,
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
  ENTER_SHIP_2,
  MEET_GRAVLAX,
  THANK_GRAVLAX,
  START_FIND_DAUGHTER_MISSION,
  TRAVEL_NODE_2,
  SUCCESS_2,
}

export enum FailureNodes {
  CRASH,
  CRASH_2,
  STARVE_TO_DEATH
}

export type NodeId = keyof typeof Node | keyof typeof FailureNodes;
export type FailureNodeId = keyof typeof FailureNodes;

export type TextNodeGraph = {
  [K in NodeId]: TextNode
};


export const GameGraph: TextNodeGraph = {
  START_1: {
    prompt: 'You\'re standing in front of the open door of a space ship.',
    options: [
      ['LEFT_1', '"Look left."'],
      ['RIGHT_1', '"Look right."'],
      ['ENTER_SHIP_1', 'Enter ship.'],
    ]
  },
  LEFT_1: {
    prompt: 'You look left. You see the inside of your space garage. Nothing is out of place.',
    options: [
      ['RIGHT_1', '"Look right."'],
      ['ENTER_SHIP_1', 'Enter ship.'],
    ]
  },
  RIGHT_1: {
    prompt: 'You look to the right. You see the door you just came out of. Now that it\'s shut, you only have about a ' +
        'minute more until the airlock runs out of air.',
    options: [
      ['LEFT_1', '"Look left."'],
      ['ENTER_SHIP_1', 'Enter ship.'],
    ]
  },
  ENTER_SHIP_1: {
    prompt: '"Welcome to your space ship, ' + process.env.REACT_APP_CHARACTER_NAME + '"',
    options: [
      ['THANKS_1', '"Thank you"'],
      ['WHO_SPEAKING', '"Who is speaking?"'],
    ]
  },
  THANKS_1: {
    prompt: '"Well, of course! Who wants a space ship that doesn\'t even welcome you aboard! Now, where are we off to today?"',
    options: [
      ['NOT_SURE', '"I\'m not sure..."'],
      ['COORDINATES_1', '"I have the coordinates right here."'],
    ]
  },
  WHO_SPEAKING: {
    prompt: '"Silly Sfinx! It\'s me, your beloved space ship, of course!! Now, where are we off to today?"',
    options: [
      ["NOT_SURE", '"I\'m not sure..."'],
      ['COORDINATES_1', '"I have the coordinates right here."'],
    ]
  },
  NOT_SURE: {
    prompt: '"Well, it\'s certainly a big galaxy out there! Let me know when you know where you want to go."',
    options: [
      ['COORDINATES_1', '"Ok, I\'m ready now!"'],
    ]
  },
  COORDINATES_1: {
    prompt: '"Enter the wormhole coordinates of your destination, and then we will be on our way!"',
    options: [],
    travelInfo: {
      failure: 'CRASH',
      success: 'FIRST_WARP'
    }
  },
  FIRST_WARP: {
    prompt: '"Warp complete!"',
    options: [],
  },
  CRASH: {
    prompt: 'Invalid coordinates. Your ship has crashed and now you\'re dead. :(',
    options: [
      ['COORDINATES_1', 'Retry?']
    ]
  },
  AFTER_FIRST_WARP: {
    prompt: 'You don\'t see anything at all. But your geiger counter starts to beep...',
    options: [
      ['FOLLOW_RADIATION_TRAIL', 'Go toward the radiation'],
      ['GO_BACK_RADIATION', 'Go away from the radiation']
    ]
  },
  GO_BACK_RADIATION: {
    prompt: 'There\'s really not much out here. You start imagining how easy it would be to get stranded out here.',
    options: [
      ['FOLLOW_RADIATION_TRAIL', 'Turn around'],
      ['KEEP_LEAVING_TRAIL', 'Keep going in this direction']
    ]
  },
  KEEP_LEAVING_TRAIL: {
    prompt: 'You still don\'t see anything out here at all. After a few days, you lose the radiation trail. After a few ' +
        'months, you begin to wonder why you are out here at all. Your food and fuel stores start to run low. You ' +
        'ration them as best you can, but without any place to resupply, the outlook is grim.',
    options: [
      ['STARVE_TO_DEATH', 'Keep searching for civilization'],
      ['STARVE_TO_DEATH', 'Give up and try to conserve your energy'],
    ]
  },
  STARVE_TO_DEATH: {
    prompt: 'It\'s been nearly a year since you left on this mission. You are weak, but you manage to tell the ship ' +
        'to send out a final distress call. No one answers. One day, you finally starve to death in you ship.',
    options: [
      ['AFTER_FIRST_WARP', 'Try again?'],
    ]
  },
  FOLLOW_RADIATION_TRAIL: {
    prompt: 'You turn on your thrusters and start accelerating toward the radiation trail. The beeps from your geiger' +
        'counter become more frequent - you must be getting closer to the source of the radiation.',
    options: [
      ['KEEP_FOLLOWING', 'Keep following the radiation trail'],
      ['GO_BACK_RADIATION', 'Go away from the radiation']
    ]
  },
  KEEP_FOLLOWING: {
    prompt: 'A dark shape appears in the distance, which resolves into a huge ship as you get closer. It looks ' +
        'strangely dark.',
    options: [
      ['KEEP_FOLLOWING_2', 'Approach the ship'],
      ['GO_BACK_RADIATION', 'Fly away from the ship']
    ]
  },
  KEEP_FOLLOWING_2: {
    prompt: 'As you get closer, you can make out a seal painted neatly on the side. This must be a royal ship - or ' +
        'maybe space pirates pretending to be one. Either way, they must be well-funded to be flying something this ' +
        'large. Or at least, at some point they were flying it. Now, the ship is drifting aimlessly, and you can\'t ' +
        'even see the glow of the thruster pilot flare.',
    options: [
        ['ENTER_SHIP_2', 'Dock with the ship.'],
    ]
  },
  ENTER_SHIP_2: {
    prompt: 'You approach the ship slowly, and dock with their docking port. The airlock hisses and slides open.',
    options: [
      ['MEET_GRAVLAX', 'Enter airlock'],
    ]
  },
  MEET_GRAVLAX: {
    prompt: '"Hi, I am Gravlax and I am actually good! My daughter got kidnapped to become a royal priestess, but I' +
        'think that\'s bullshit. I just found out where she is, but now I am dying of radiation poisoning. Will you ' +
        'save her? The code to open the box is 785."',
    options: [
      ['THANK_GRAVLAX', '"Thank you"'],
      ['THANK_GRAVLAX', '"Well this feels a bit too easy..."'],
    ]
  },
  THANK_GRAVLAX: {
    prompt: '"Oh sure, couldn\'t make this too complicated since Eli is just making sure it works! Inside the box, you' +
        ' will find the last mail drop I ever got from Gorgo. The password is her name."',
    options: [
      ['START_FIND_DAUGHTER_MISSION', '"Hmmm..."'],
      ['START_FIND_DAUGHTER_MISSION', '"I guess that makes sense...?"'],
      ['START_FIND_DAUGHTER_MISSION', '"Well, you are the expert!"'],
    ]
  },
  START_FIND_DAUGHTER_MISSION: {
    prompt: '"Where are we going today?"',
    options: [],
    travelInfo: {
      failure: "CRASH_2",
    }
  },
  CRASH_2: {
    prompt: 'It didn\'t work. Your ship has crashed and now you\'re dead. :(',
    options: [
      ['START_FIND_DAUGHTER_MISSION', 'Retry?']
    ]
  },
  TRAVEL_NODE_2: {
    prompt: 'Warp jump successful! Where to?',
    options: [],
    travelInfo: {
      failure: "CRASH_2",
      success: "SUCCESS_2"
    }
  },
  SUCCESS_2: {
    prompt: '"Hi, I am Gorgonzola! You rescued me, good job! The final code is 802."',
    options: []
  }
}