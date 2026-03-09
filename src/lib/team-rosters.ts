export type PlayerRole = "Batsman" | "Fast Bowler" | "Spin Bowler" | "Wicket Keeper" | "All-Rounder";

export type Player = {
  name: string;
  role: PlayerRole;
  number: number;
};

export type TeamRoster = {
  teamName: string;
  teamCode: string;
  slug: string;
  tagline: string;
  players: Player[];
};

function parseRole(raw: string): PlayerRole {
  if (/fast|faster/i.test(raw)) return "Fast Bowler";
  if (/spin/i.test(raw)) return "Spin Bowler";
  if (/w\.?k|wicket/i.test(raw)) return "Wicket Keeper";
  return "Batsman";
}

function p(num: number, raw: string): Player {
  const match = raw.match(/^(.+?)\s*\((.*?)\)\s*$/);
  if (match) return { number: num, name: match[1].trim(), role: parseRole(match[2]) };
  return { number: num, name: raw.trim(), role: "Batsman" };
}

export const teamRosters: TeamRoster[] = [
  {
    teamName: "Darbhanga Strikers",
    teamCode: "A",
    slug: "darbhanga-strikers",
    tagline: "Strike hard, strike fast — no mercy on the pitch!",
    players: [
      p(1, "Ankit Raj"), p(2, "Manikarnika Azad"), p(3, "Md. Zeeshan"), p(4, "Gautam Kumar Jha"),
      p(5, "Suyash Bhardwaj"), p(6, "Prashant Kumar"), p(7, "Anurag Kumar (Fast)"), p(8, "Md. Hamza (Fast)"),
      p(9, "Shivansh (Spin)"), p(10, "Piyush (Fast)"), p(11, "Nitish Kumar (W.K)"), p(12, "Ranishk Kumar"),
      p(13, "Aasish Kumar"),
    ],
  },
  {
    teamName: "Darbhanga Super XI",
    teamCode: "B",
    slug: "darbhanga-super-xi",
    tagline: "Eleven warriors, one unstoppable force!",
    players: [
      p(1, "Adarsh Kumar (Fast)"), p(2, "Raja Kumar Sahu"), p(3, "Inayatullah"), p(4, "Ashu Raja"),
      p(5, "Sanskar Singh"), p(6, "Sammar Kumar"), p(7, "Santosh Kumar (Fast)"), p(8, "Aman Jha (Fast)"),
      p(9, "Ayush Kumar (Fast)"), p(10, "Ayush Mishra (Spin)"), p(11, "Sahil Jatodiya (W.K)"),
      p(12, "Aman Kumar"), p(13, "Mohit Nayak"),
    ],
  },
  {
    teamName: "Darbhanga Tigers",
    teamCode: "C",
    slug: "darbhanga-tigers",
    tagline: "Fearless like tigers, relentless on the crease!",
    players: [
      p(1, "Sonu Kumar Mukhiya"), p(2, "Aatish Sharma"), p(3, "Abhishek Kumar Choudhary (W.K)"),
      p(4, "Anurag Jha"), p(5, "Aaryan Solanki"), p(6, "Manmeet Kumar"), p(7, "Md. Zain Alam (Fast)"),
      p(8, "Keshav Kumar (Fast)"), p(9, "Sonu Kumar (Fast)"), p(10, "Aniket Raj (Spin)"),
      p(11, "Shanu Khan"), p(12, "Sonu Kumar"), p(13, "Kumar Harshvardhan"),
    ],
  },
  {
    teamName: "Darbhanga Warriors",
    teamCode: "D",
    slug: "darbhanga-warriors",
    tagline: "Born to battle, built to win!",
    players: [
      p(1, "Ankit Raj"), p(2, "Rahat Ali"), p(3, "Rishu Kumar"), p(4, "Deepak Kumar"),
      p(5, "Adarsh Singh (Spin)"), p(6, "Rohit Karnataki"), p(7, "Harihar Choudhary (Fast)"),
      p(8, "Manish Kumar (Fast)"), p(9, "Roshan Kumar (Fast)"), p(10, "Kaish Kumar (Spin)"),
      p(11, "Dilkush Kumar (W.K)"), p(12, "Raushan Kumar Mishra"), p(13, "Prince Jha"),
    ],
  },
  {
    teamName: "Darbhanga Kings",
    teamCode: "E",
    slug: "darbhanga-kings",
    tagline: "Rule the pitch like royalty!",
    players: [
      p(1, "Aarahm Ahamed (W.K)"), p(2, "Abdul Rehman"), p(3, "Abhimanu"), p(4, "Ayush Kumar"),
      p(5, "Pushkar Raj"), p(6, "Naman Kumar Sahu"), p(7, "Md. Shahrukh (Fast)"),
      p(8, "Ujjwal Kumar (Fast)"), p(9, "Sahib (Fast)"), p(10, "Sachin Kumar (Spin)"),
      p(11, "Madan Kumar"), p(12, "Divyanshu"), p(13, "Ishome Kumar"),
    ],
  },
  {
    teamName: "Darbhanga Lions",
    teamCode: "F",
    slug: "darbhanga-lions",
    tagline: "Roar with pride, conquer with courage!",
    players: [
      p(1, "Prince Jha"), p(2, "Kaish Gupta"), p(3, "Suwaarn Kumar"), p(4, "Ankit Kumar Yadav"),
      p(5, "Abhishek Kumar"), p(6, "Prince Kumar Jha"), p(7, "Rohit Kumar (Fast)"),
      p(8, "Md. Mustafa (Fast)"), p(9, "Md. Faheem (Fast)"), p(10, "Chetanye Raj (Spin)"),
      p(11, "Farhan Azam (W.K)"), p(12, "Md Albakash"), p(13, "Aayush Raj"),
    ],
  },
  {
    teamName: "Darbhanga Panthers",
    teamCode: "G",
    slug: "darbhanga-panthers",
    tagline: "Silent approach, deadly finish!",
    players: [
      p(1, "Saurav Parsad"), p(2, "Visnu Kumar"), p(3, "Rituraj Pojyadarsh"), p(4, "Mohmad Ruhmaan"),
      p(5, "Babul Giri (Fast)"), p(6, "Nishant Kumar"), p(7, "Sujit Kumar (Fast)"),
      p(8, "Avilash Kumar (Fast)"), p(9, "Rahat (Fast)"), p(10, "Aniket Raj (Spin)"),
      p(11, "Deepak Kumar Choudhary (W.K)"), p(12, "Prabhakar Kumar"), p(13, "Kumar Sahil"),
    ],
  },
  {
    teamName: "Darbhanga Royals",
    teamCode: "H",
    slug: "darbhanga-royals",
    tagline: "Grace, power, and championship pedigree!",
    players: [
      p(1, "Kunal Kumar"), p(2, "Ankit Kumar (W.K)"), p(3, "Aditya Raj"), p(4, "Aditya Pratihast"),
      p(5, "Paanav Choudhary (Fast)"), p(6, "Sachin Kumar"), p(7, "Jakur Khan (Fast)"),
      p(8, "Sudhanshu Kumar (Fast)"), p(9, "Ankit Kumar (Fast)"), p(10, "Ankit Sandilya (Spin)"),
      p(11, "Bala Kumar Jha (W.K)"), p(12, "Aadarsh Raj"), p(13, "Yuvraj Kumar"),
    ],
  },
  {
    teamName: "Darbhanga Blasters",
    teamCode: "I",
    slug: "darbhanga-blasters",
    tagline: "Blast every boundary, shatter every record!",
    players: [
      p(1, "Sohan Kumar"), p(2, "Md. Hussain"), p(3, "Ankit Kumar"), p(4, "Guddu Thakur"),
      p(5, "Shivam Thakur"), p(6, "Mankhush Yadav"), p(7, "Mehboob Alam (Fast)"),
      p(8, "Kartik Jha (Fast)"), p(9, "Rajesh Kumar (Fast)"), p(10, "Sajid Rehman (Spin)"),
      p(11, "Inayatullah (W.K)"), p(12, "Satyam Kumar"), p(13, "Md. Amir Khan"),
    ],
  },
  {
    teamName: "Darbhanga Challengers",
    teamCode: "J",
    slug: "darbhanga-challengers",
    tagline: "Challenge accepted — victory guaranteed!",
    players: [
      p(1, "Md Ruhan"), p(2, "Rohan Jha (Fast)"), p(3, "Anurag Jha"), p(4, "Raman Raj"),
      p(5, "Shubham Kumar"), p(6, "Ajay Kumar"), p(7, "Samsher Alam (Fast)"),
      p(8, "Kumar Gaurav (Fast)"), p(9, "Avinish Kumar (Fast)"), p(10, "Sanjeev Kumar (Spin)"),
      p(11, "Prince Kumar (W.K)"), p(12, "Alok Kumar"), p(13, "Sourav Thakur"),
    ],
  },
  {
    teamName: "Darbhanga Falcons",
    teamCode: "K",
    slug: "darbhanga-falcons",
    tagline: "Swift as falcons, sharp as victory!",
    players: [
      p(1, "Deepak Kumar (W.K)"), p(2, "Golu Raj"), p(3, "Pratyush Kumar (Fast)"),
      p(4, "Md. Ruhan (Spin)"), p(5, "Sahil Kumar (Spin)"), p(6, "Shubham"),
      p(7, "Fahim Ahmad"), p(8, "Vivek Kumar"), p(9, "Shashank Sourya"),
      p(10, "Keshav Singh (Fast)"), p(11, "Avinish Kumar (Fast)"), p(12, "Tanish Kumar"),
      p(13, "Md. Altamas"),
    ],
  },
  {
    teamName: "Darbhanga Hurricanes",
    teamCode: "L",
    slug: "darbhanga-hurricanes",
    tagline: "A storm on the field that no one can stop!",
    players: [
      p(1, "Abhishek Kumar (W.K)"), p(2, "Prashant Kumar"), p(3, "Avinash Kumar"),
      p(4, "Sohan Kumar"), p(5, "Anand Kumar (W.K)"), p(6, "Rahul Chaussiya (Fast)"),
      p(7, "Lokesh Kumar Singh (Fast)"), p(8, "Premanand Kumar Yadav (Fast)"),
      p(9, "Jay Prakash Mishra (Fast)"), p(10, "Krishan Kumar (Spin)"),
      p(11, "Atul Kehtan (Spin)"), p(12, "Siddhant Gupta"), p(13, "Ankit Sandilya"),
    ],
  },
];

export const getRosterBySlug = (slug: string) => teamRosters.find((t) => t.slug === slug);
