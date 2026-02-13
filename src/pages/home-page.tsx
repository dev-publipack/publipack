import { MachineContainer } from '@/components/machine-container';
import { PrizePopup } from '@/components/prize-popup';
import { MainContentContainerWrapper } from '@/shared/ui/wrappers/main-content-container';


export default function HomePage() {
  return (
    <div className="min-h-screen bg-[url('/design/bg/bg.svg')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
      {/* <ClaimForm onSubmit={() => { }} /> */}
      <PrizePopup username="John Doe" prize="100" />
      <MachineContainer>
        <MainContentContainerWrapper >

        </MainContentContainerWrapper>
        {/* <Spinner offers={['1', '2', '3', '4', '5', '6', '7', '8', '9']} /> */}
      </MachineContainer>
    </div>
  );
}
