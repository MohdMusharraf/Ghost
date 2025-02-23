import Modal from '../../../admin-x-ds/global/modal/Modal';
import NavigationEditForm from './navigation/NavigationEditForm';
import NiceModal, {useModal} from '@ebay/nice-modal-react';
import TabView from '../../../admin-x-ds/global/TabView';
import useNavigationEditor, {NavigationItem} from '../../../hooks/site/useNavigationEditor';
import useSettingGroup from '../../../hooks/useSettingGroup';
import {getSettingValues} from '../../../utils/helpers';

const NavigationModal = NiceModal.create(() => {
    const modal = useModal();

    const {
        localSettings,
        updateSetting,
        saveState,
        handleSave,
        siteData
    } = useSettingGroup();

    const [navigationItems, secondaryNavigationItems] = getSettingValues<string>(
        localSettings,
        ['navigation', 'secondary_navigation']
    ).map(value => JSON.parse(value || '[]') as NavigationItem[]);

    const navigation = useNavigationEditor({
        items: navigationItems,
        setItems: (items) => {
            updateSetting('navigation', JSON.stringify(items));
        }
    });

    const secondaryNavigation = useNavigationEditor({
        items: secondaryNavigationItems,
        setItems: items => updateSetting('secondary_navigation', JSON.stringify(items))
    });

    return (
        <Modal
            buttonsDisabled={saveState === 'saving'}
            dirty={localSettings.some(setting => setting.dirty)}
            scrolling={true}
            size='lg'
            stickyFooter={true}
            title='Navigation'
            onOk={async () => {
                if (navigation.validate() && secondaryNavigation.validate()) {
                    await handleSave();
                    modal.remove();
                }
            }}
        >
            <div className='-mb-8 mt-6'>
                <TabView
                    tabs={[
                        {
                            id: 'primary-nav',
                            title: 'Primary navigation',
                            contents: <NavigationEditForm baseUrl={siteData!.url} navigation={navigation} />
                        },
                        {
                            id: 'secondary-nav',
                            title: 'Secondary navigation',
                            contents: <NavigationEditForm baseUrl={siteData!.url} navigation={secondaryNavigation} />
                        }
                    ]}
                />
            </div>
        </Modal>
    );
});

export default NavigationModal;
