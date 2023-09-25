import { useSocket } from "@/common/hooks/useSocket";
import { PlayHeader } from "@/modules/play2/components/play-header/PlayHeader";
import { useGame, useGameSpectator } from "@/modules/play2/hooks/useGame";
import { useConnectionManager } from "@/modules/play2/state/connection-store";
import jpcs_logo from "@/assets/icons/jpcs_logo.png";
import { useSettingsStore } from "@/modules/play2/state/settings-store";

function SpectatorPage() {

    useSettingsStore.setState((s) => ({
        ...s,
        navBarVisible: false,
    }));
    useSocket();
    useConnectionManager();
    const game = useGameSpectator();

    return (
        <div className="main-background" style={{
            height: '100vh',
        }}>
            {game?.isSpectate && (

                <div style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    translate: 'translateY`()',
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: '3'
                    }}>
                        <img src={jpcs_logo.src} style={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                            width: '75%',
                        }} />
                    </div>

                    <div style={{
                        width: '50%',
                        flex: '2'
                    }}>

                        <PlayHeader></PlayHeader>
                    </div>
                </div>
            )}
        </div>
    );
}



export default SpectatorPage;