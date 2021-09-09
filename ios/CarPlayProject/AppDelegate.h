#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <CarPlay/CarPlay.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, CPApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
