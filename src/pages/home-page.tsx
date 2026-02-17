import { MachineContainer } from '@/components/machine-container';
import { ChainBlockTop } from '@/shared';
import { SPONSORS } from '@/shared/lib/constants';
import { MainContentContainerWrapper } from '@/shared/ui/wrappers/main-content-container';


export default function HomePage() {
  return (
    <div className="min-h-screen bg-[url('/design/bg/bg.svg')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center">
      <ChainBlockTop text="SPIN NOW" />
      <div className="relative w-full max-w-[398px] flex flex-col items-center overflow-visible">
        <MachineContainer>
          <MainContentContainerWrapper sponsors={SPONSORS} onComplete={() => { }} />
        </MachineContainer>
      </div>
    </div>
  );
}
