export const IntroMessage = () => {
  return <>
    <p>Dear {process.env.REACT_APP_CHARACTER_NAME},</p>

    <p>If you are reading this, I am probably dead.
    </p>
    <p>There is a spy on my ship. I thought we had a solid, trustworthy crew, but recently some things have not been
      adding up. I still don’t know what her plan is, but the lieutenant commander, Gravlax, has been giving me false
      data about our wormcoor drive.
    </p>
    <p>Sometime last megasecond, only halfway through our reconnaissance mission in the Galactic Demilitarized Zone, she
      told me our wormcoor drive was malfunctioning and we needed to get it serviced. Getting to a royal base was out of
      the question this far out in the GDZ, so she convinced us to stop at a planet I’d never heard of — supposedly she
      has a friendly contact.
    </p>
    <p>You remember Pippin, our old buddy from the Second Space War? Well, believe it or not, she’s our chief ship’s
      mechanic! Something was giving me a funny feeling, and just to make sure, I checked in with her - and sure enough,
      she hadn’t heard anything about it. She said the wormcoor drive was working just fine, and you know there isn’t
      anyone in the galaxy who knows wormhole coordination drives like ol’ Pip!
    </p>
    <p>Then Pippin told me that she was booked for a megasecond of on-ship R&R starting that day, but that she had just
      been in the neural regeneration booth a few megaseconds ago, and that she wasn’t due for refurbishment for at
      least another 10 megaseconds! Pip thought that it must have been an administrative error — but it seemed fishy to
      me. Luckily I have admin credentials in the Regeneration and Refurbishment portal, and that’s how I found out that
      none other than Gravlax had scheduled an override! She said she was planning on speaking with Gravlax to get it
      sorted.
    </p>
    <p>Today I saw her arm in the spare parts bin, and I still haven’t found her neural core. I looked into our ship’s
      database, and there is no trace of Pippin ever having existed on our ship.
    </p>
    <p>Well, you know how paranoid I am — I thought it would be best to contact someone outside of the chain of command,
      just in case. I know you don’t always operate within the strict bounds of space law — but that might be exactly
      what I need right now.
    </p>
    <p>I’ve prepared the package you’ve just opened and sent it to a space cargo center, addressed to your local cargo
      pickup satellite. Every 100 kiloseconds I have been sending them instructions by space-mail to delay sending it by
      another 100 kiloseconds. If you have received it, it means I am incapacitated in some way.
    </p>
    <p>I’ve included my wormcoor navigator, but without a Royal Space Seal it’ll only work with relative coordinates for
      your quadrant. I’ve included the relative coordinates of the wormcoor service station we were headed to. If you
      are still operating in the quadrant B47, those coordinates should be enough.
    </p>
    <p>I’m no fool, {process.env.REACT_APP_CHARACTER_NAME}; I know you won’t take a mission, even for an old
      friend, unless there is something in it for you. The Royal Galactic Empire compensates the family of a Royal
      Reconnaissance Commander very well in the event of their death. You know I have no family; I have put down a fake
      name as my only next of kin. If you find me, you can find the fake name and galactic identifier stored in my
      neural drive. That information is all you need to claim your inheritance from the Royal Galactic Empire. It should
      be plenty for you to buy yourself a bulletproof new identity and a shiny new ship, and start a nice new life on
      the other side of the GDZ, far away from the space police.
    </p>
    <p style={{textIndent: 0}}>Best of luck,</p>
    <p style={{textIndent: 0, margin: 0}}>Chase Ruttle</p>
    <p style={{textIndent: 0, margin: 0, fontStyle: 'italic'}}>Royal Reconnaissance Commander</p>
  </>
}