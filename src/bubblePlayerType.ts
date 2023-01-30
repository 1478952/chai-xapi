export interface BubblePlayerConstructor {
  lrsUrl: string;
  sessionId: string;
  homepageUrl: string;
  userAgent: string;
  course: string;
  totalPage: number;
  activityId: string;
  contentName: string;
  description: string;
  actor: CreateActorProps;
}

export interface Observer {
  name: string;
  state: string | number;
  callback?: (props?: any) => void;
}

interface Account {
  homePage: string;
  name: string;
}

export interface Actor {
  account?: Account;
  mbox?: string;
  name: string;
  objectType: string;
}

export interface CreateActorProps {
  account?: {
    homePage: string;
    name: string;
  };
  mbox?: string;
  name: string;
  objectType: string;
}

export interface PlayerXObject {
  objectType: "string";
  id: string;
  definition: {
    type: string;
    name: {
      "en-US": string;
    };
    description: {
      "en-US": string;
    };
    extensions?: Extensions;
  };
}

export interface setObjectDataProps {
  type: string;
  name: { "en-US": string };
  description: { "en-US": string };
}

export interface Extensions {
  [key: string]: string | number | object;
}

export interface ResultExtensionStructure {
  completion: boolean;
  response: string;
  duration: string;
  score: {
    scaled: number;
    raw: number;
    max: number;
    min: number;
  };
}
