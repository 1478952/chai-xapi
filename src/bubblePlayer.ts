import {
  Actor,
  BubblePlayerConstructor,
  CreateActorProps,
  Extensions,
  Observer,
  PlayerXObject,
  ResultExtensionStructure,
  setObjectDataProps,
} from "./bubblePlayerType";

export class BubblePlayer {
  ADL: any;
  xapiWrapper: any;
  observers: Observer[];
  lrsUrl: string;
  sessionId: string;
  homepageUrl: string;
  userAgent: string;
  course: string;
  subject: string | undefined;
  lesson: string | undefined;
  totalPage: number;
  sumActualLearningTime: number;
  activityId: string;
  contentName: string;
  description: string;
  actor: Actor | undefined;
  playerXObject: PlayerXObject | undefined;
  pageSegment: string;
  sendSynchronous: boolean;
  objectContext: undefined | Extensions;
  contextDetails: undefined | Extensions;
  extensionDetails: undefined | Extensions;
  resultExtensions: undefined | Extensions;
  resultExtensionStructure: ResultExtensionStructure | undefined;
  actualStartLearningTime: Date;
  completion: boolean;
  currentPageSegment: string[] | number[];
  prevSegmentStart: string | number | undefined;

  constructor({
    lrsUrl,
    sessionId,
    homepageUrl,
    userAgent,
    course,
    totalPage,
    activityId,
    contentName,
    description,
    actor,
  }: BubblePlayerConstructor) {
    //@ts-ignore
    this.ADL = window.ADL;
    //@ts-ignore
    this.xapiWrapper = ADL.XAPIWrapper;

    this.observers = [];
    this.lrsUrl = lrsUrl;
    this.sessionId = sessionId;
    this.homepageUrl = homepageUrl;
    this.userAgent = userAgent;
    this.course = course;
    this.totalPage = totalPage;
    this.activityId = activityId;
    this.contentName = contentName;
    this.description = description;
    this.pageSegment = "";
    this.sendSynchronous = false;
    this.objectContext = undefined;
    this.contextDetails = undefined;
    this.extensionDetails = undefined;
    this.resultExtensions = undefined;
    this.actualStartLearningTime = new Date();
    this.sumActualLearningTime = 0;
    this.completion = false;
    this.currentPageSegment = [];
    this.prevSegmentStart = undefined;
    this.createActor(actor);
  }

  /**
   * NOTE kjw xapi actor 초기값 설정함수
   */
  createActor = (actor: CreateActorProps) => {
    this.actor = actor;

    const conf = {
      endpoint: this.lrsUrl,
      actor: JSON.stringify(this.actor),
      auth: "Basic Og==",
    };
    this.ADL.XAPIWrapper.changeConfig(conf);
  };

  /**
   * NOTE kjw xapi statement에 actor와 object를 넣어주는 함수
   */
  bareStatement = (playerXObject: PlayerXObject) => {
    if (!this.actor) {
      return;
    }
    const statement = new this.ADL.XAPIStatement();

    statement.actor = this.actor;
    statement.object = playerXObject;
    return statement;
  };

  addCurrentSegment() {
    console.log(this.currentPageSegment);
    console.log(this.prevSegmentStart);
    const currSegmentStr = `${
      this.prevSegmentStart || this.formatFloat(this.currentPageSegment[0])
    }[.]${this.formatFloat(this.currentPageSegment[1])}`;
    this.prevSegmentStart = this.formatFloat(this.currentPageSegment[1]);
    this.pageSegment =
      this.pageSegment === ""
        ? currSegmentStr
        : [this.pageSegment, currSegmentStr].join("[,]");
  }

  initialize = () => {
    this.sumActualLearningTime = 0;
    this.playerXObject = new this.ADL.XAPIStatement.Activity(this.activityId);
    const object_temp = {
      type: "https://w3id.org/xapi/acrossx/verbs/evaluated",
      name: {
        "en-US": this.contentName || "",
      },
      description: {
        "en-US": this.description || "",
      },
    };

    if (this.playerXObject) {
      if (this.objectContext) {
        this.playerXObject.definition = this.setObject(
          object_temp,
          this.objectContext
        );
      } else {
        this.playerXObject.definition = object_temp;
      }

      if (typeof this.contentName === "object") {
        this.playerXObject.definition.name = this.contentName;
      } else {
        this.playerXObject.definition.name = { "en-US": this.contentName };
      }
      if (typeof this.description === "object") {
        this.playerXObject.definition.description = this.description;
      } else {
        this.playerXObject.definition.description = {
          "en-US": this.description,
        };
      }
    }

    this.sendInitialized();
  };

  terminate = () => {
    // returnURL = returnURL || "https://www.google.com";
    this.sendSynchronous = true;
    this.sendTerminated();
  };

  sendInitialized = () => {
    if (!this.playerXObject) {
      return;
    }
    const mys = this.bareStatement(this.playerXObject);
    mys.id = this.sessionId;
    mys.verb = new this.ADL.XAPIStatement.Verb(
      "http://adlnet.gov/expapi/verbs/initialized",
      "initialized"
    );

    mys.context = {
      extensions: {
        "https://w3id.org/xapi/bubble-player/extensions/session-id":
          this.sessionId,
        "https://w3id.org/xapi/bubble-player/extensions/src": this.homepageUrl,
        "https://w3id.org/xapi/bubble-player/extensions/user-agent":
          this.userAgent,
        "https://w3id.org/xapi/bubble-player/extensions/course": this.course,
        "https://w3id.org/xapi/bubble-player/extensions/subject": this.course,
        "https://w3id.org/xapi/bubble-player/extensions/lesson": this.course,
        "https://w3id.org/xapi/bubble-player/extensions/total-page":
          this.totalPage,
      },
    };
    if (this.contextDetails && this.extensionDetails) {
      mys.context = this.setContext(
        mys.context,
        this.contextDetails,
        this.extensionDetails
      );
    }
    this.xapiWrapper.sendStatement(mys);
    window.postMessage(JSON.stringify(mys));
  };

  sendStart = (pageIndex: number) => {
    if (!this.playerXObject) {
      return;
    }

    const mys = this.bareStatement(this.playerXObject);
    this.actualStartLearningTime = new Date();
    this.currentPageSegment = [pageIndex, pageIndex];

    mys.verb = new this.ADL.XAPIStatement.Verb(
      "https://w3id.org/xapi/bubble-player/verbs/interacted",
      "interacted"
    );
    mys.result = {
      extensions: {
        "https://w3id.org/xapi/bubble-player/extensions/session-id":
          this.sessionId,
        "https://w3id.org/xapi/bubble-player/extensions/course": this.course,
        "https://w3id.org/xapi/bubble-player/extensions/subject": this.course,
        "https://w3id.org/xapi/bubble-player/extensions/lesson": this.course,
        "https://w3id.org/xapi/bubble-player/extensions/turn": this.course,
      },
    };

    if (this.resultExtensionStructure && this.resultExtensions) {
      mys.result = this.setContext(
        mys.result,
        this.resultExtensionStructure,
        this.resultExtensions
      );
    }

    this.xapiWrapper.sendStatement(mys);
    window.postMessage(JSON.stringify(mys));
  };

  sendProgressed = (pageIndex: number, percent: number) => {
    if (!this.playerXObject) {
      return;
    }
    const mys = this.bareStatement(this.playerXObject);
    const duration =
      new Date().getTime() - this.actualStartLearningTime.getTime();

    this.actualStartLearningTime = new Date();
    this.currentPageSegment[0] = this.currentPageSegment[1];
    this.currentPageSegment[1] = pageIndex;
    this.addCurrentSegment();

    mys.verb = new this.ADL.XAPIStatement.Verb(
      "http://adlnet.gov/expapi/verbs/progressed",
      "progressed"
    );
    mys.result = {
      extensions: {
        "https://w3id.org/xapi/bubble-player/extensions/session-id":
          this.sessionId,
        "https://w3id.org/xapi/bubble-player/extensions/page": pageIndex,
        "https://w3id.org/xapi/bubble-player/extensions/percent": percent,
        "https://w3id.org/xapi/bubble-player/extensions/played-segments":
          this.pageSegment,
        "https://w3id.org/xapi/bubble-player/extensions/duration": duration,
        "https://w3id.org/xapi/bubble-player/extensions/completion":
          percent > 90 ? true : false,
      },
    };

    if (this.resultExtensionStructure && this.resultExtensions) {
      mys.result = this.setContext(
        mys.result,
        this.resultExtensionStructure,
        this.resultExtensions
      );
    }

    this.xapiWrapper.sendStatement(mys);
    window.postMessage(JSON.stringify(mys));
  };

  sendComplete = () => {
    if (!this.playerXObject) {
      return;
    }
    const mys = this.bareStatement(this.playerXObject);

    mys.verb = new this.ADL.XAPIStatement.Verb(
      "http://adlnet.gov/expapi/verbs/completed",
      "completed"
    );
    mys.result = {
      success: true,
      extensions: {
        "https://w3id.org/xapi/bubble-player/extensions/session-id":
          this.sessionId,
        "https://w3id.org/xapi/bubble-player/extensions/played-segments":
          this.pageSegment,
      },
    };
    if (this.resultExtensionStructure && this.resultExtensions) {
      mys.result = this.setContext(
        mys.result,
        this.resultExtensionStructure,
        this.resultExtensions
      );
    }
    this.xapiWrapper.sendStatement(mys);
    window.postMessage(JSON.stringify(mys));
  };

  sendTerminated = () => {
    if (!this.playerXObject) {
      return;
    }
    const mys = this.bareStatement(this.playerXObject);

    mys.verb = new this.ADL.XAPIStatement.Verb(
      "http://adlnet.gov/expapi/verbs/terminated",
      "terminated"
    );
    mys.result = {
      extensions: {
        "https://w3id.org/xapi/bubble-player/extensions/session-id":
          this.sessionId,
        "https://w3id.org/xapi/bubble-player/extensions/played-segments":
          this.pageSegment,
      },
    };
    this.xapiWrapper.sendStatement(mys); // send synchronously
    window.postMessage(JSON.stringify(mys));
  };

  setContext = (
    obj: Extensions,
    detail: Extensions | ResultExtensionStructure,
    Extensions: Extensions
  ) => {
    const assignDetail = Object.assign(obj, detail);
    const assignContext = Object.assign(assignDetail.extensions, Extensions);
    return assignContext;
  };

  setObject = (data: setObjectDataProps, objectContext: Extensions) => {
    const res = {};
    const assignData = Object.assign(res, data);

    if (objectContext) {
      const extensionsObject = {
        extensions: objectContext,
      };
      const assignObject = Object.assign(assignData, extensionsObject);
      return assignObject;
    }

    return assignData;
  };

  formatFloat = (number: number | string) => {
    if (number === undefined) {
      return undefined;
    }
    if (typeof number === "string") {
      return +parseFloat(number).toFixed(3);
    } else {
      return number.toFixed(3);
    }
  };

  addObjectContext = (object_context: Extensions) => {
    this.objectContext = object_context;
  };

  addResultExtension(result_extensions: Extensions) {
    this.resultExtensions = result_extensions;
    this.resultExtensionStructure = {
      completion: false,
      response: "",
      duration: "PT0H0M0S",
      score: {
        scaled: 0,
        raw: 0,
        max: 100,
        min: 0,
      },
    };
  }

  addContextDetail = (context_details: Extensions) => {
    this.contextDetails = context_details;
  };

  addExtensionDetail = (extension_details: Extensions) => {
    this.extensionDetails = extension_details;
  };

  notify = (observer: Observer) => {
    if (observer.callback) {
      observer.callback();
    }
  };

  unSubscribe = (observer: Observer) => {
    this.observers = this.observers.filter(
      (deleteObserver) => observer.name !== deleteObserver.name
    );
  };

  subscribe = (observer: Observer) => {
    this.observers.push(observer);
  };

  dispatch = (observer: Observer) => {
    this.observers.forEach((activeObserver) => {
      if (
        observer.name === activeObserver.name &&
        observer.state !== activeObserver.state
      ) {
        this.notify(activeObserver);
        return;
      }
    });
  };
}
