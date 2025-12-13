export interface Sponsor {
  name: string;
  reward: string;
  logo: string;
  url?: string;
  scale?: 'small' | 'medium' | 'large' | 'xlarge'; // small = 60%, medium = 75%, large = 100%, xlarge = 150% (default: large)
  text?: string; // Sponsor text displayed below logo in carousels
}

