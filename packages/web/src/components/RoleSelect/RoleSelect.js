import { useTranslation } from 'react-i18next';
import Select from 'react-select';

function RoleSelect({ handleSelectChange, error }) {
  const [t] = useTranslation('global');

  const userTypeOptions = [
    { value: 'student', label: t('signUp.student') },
    { value: 'teacher', label: t('signUp.teacher') },
  ];

  const selectTheme = (theme) => ({
    ...theme,
    borderRadius: 8,
    margin: 20,
    colors: {
      ...theme.colors,
      primary: 'var(--color-theme-lines)', // color for selected option in list
      primary25: 'var(--color-theme-primary)', // hover select
      neutral0: 'var(--color-theme-secondary)', // background color
      neutral80: 'var(--color-text)', // text
      neutral90: '#000000',
    },
  });

  return (
    <div style={{ gridColumn: '-1 / 1' }} className="w-full">
      <small className={`body-text-s ${error ? '!text-red' : ''} whitespace-nowrap`}>
        {t('signUp.userType')}
        :
      </small>
      <Select
        id="role"
        options={userTypeOptions}
        onChange={handleSelectChange}
        classNamePrefix="react-select"
        theme={selectTheme}
      />
      <span className="body-text-s !text-red h-[8px]">
        {error?.message}
        {' '}
      </span>
    </div>
  );
}

export default RoleSelect;
